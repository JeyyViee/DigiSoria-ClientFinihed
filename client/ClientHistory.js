import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Linking, Alert, TextInput, TouchableOpacity, ImageBackground, Modal, Image } from "react-native";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, firebase, storage } from "../firebase/firebaseUserConfig"; 
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as WebBrowser from 'expo-web-browser';
import { getAuth } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/Ionicons"; // Icon for search and sorting dropdown
import Header from "../components/Header";
import backgroundImage from '../assets/background.png';
import { Ionicons } from '@expo/vector-icons';


const getCartItems = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not authenticated");
      return [];
    }

    const cartCollectionRef = collection(db, "cart");
    const userCartQuery = query(cartCollectionRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(userCartQuery);
    const cartItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched Cart Items for User:", cartItems);
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

const ClientHistory = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Date", "Price");
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [payment_refId, setPaymentRefId] = useState(""); // State to store the payment reference ID
  const [screenshot, setScreenshot] = useState(null); // State for the screenshot
  const [uploading, setUploading] = useState(false); // State to manage upload process
  const [downloadURL, setDownloadURL] = useState(null); // State to store the uploaded image URL
  const [firestoreID, setFirestoreID] = useState(null); // Firestore document ID for tracking
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [instructionModalVisible, setInstructionModalVisible] = useState(true);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [price, setPrice] = useState('');
  const [disabledTransactions, setDisabledTransactions] = useState({});
  const [notifiedTransactions, setNotifiedTransactions] = useState({});

  let isDownloading = false;

useEffect(() => {
  const fetchTransactions = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    // Listen to the user's cart in real-time
    const cartCollectionRef = collection(db, "cart");
    const userCartQuery = query(cartCollectionRef, where("userId", "==", user.uid));

    const unsubscribeCart = onSnapshot(userCartQuery, async (cartSnapshot) => {
      const cartItems = cartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCartItems(cartItems);
      await checkDisabledTransactions(cartItems);
      // Check each cart item against transactions collection
      const transactionsRef = collection(db, "transactions");
      const notificationState = { ...notifiedTransactions };

      for (const item of cartItems) {
        const cartId = item.id;

        const transactionQuery = query(transactionsRef, where("cartId", "==", cartId));
        onSnapshot(transactionQuery, (transactionSnapshot) => {
          if (!transactionSnapshot.empty) {
            const transaction = transactionSnapshot.docs[0].data();
            if (!notificationState[cartId]) {
              notificationState[cartId] = true;
            }
          }
        });
      }

      setNotifiedTransactions(notificationState);
    });

    return () => unsubscribeCart(); // Cleanup listener
  };

  fetchTransactions();
}, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const items = await getCartItems();
    setCartItems(items);
    setRefreshing(false); // Stop refreshing
  };

const checkDisabledTransactions = async (cartItems) => {
  try {
    const transactionsRef = collection(db, "transactions");
    const updatedDisabledState = {};

    for (const item of cartItems) {
      const cartId = item.id; // Assuming 'id' is the cartId
      const querySnapshot = await getDocs(
        query(transactionsRef, where("cartId", "==", cartId))
      );

      // Check if any transaction exists with `completed: true`
      if (!querySnapshot.empty) {
        const transaction = querySnapshot.docs[0].data();
        if (transaction.completed) {
          updatedDisabledState[cartId] = true; // Mark as disabled
        }
      }
    }

    setDisabledTransactions(updatedDisabledState);
  } catch (error) {
    console.error("Error checking transactions:", error);
  }
};


  const handleDelete = async (itemId) => {
    try {
      const cartItemRef = doc(db, "cart", itemId);
      await deleteDoc(cartItemRef);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      Alert.alert("Success", "Item deleted from cart.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      Alert.alert("Error", "Could not delete item from cart.");
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredItems = cartItems.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortOption === "A-Z") return a.name.localeCompare(b.name);
    if (sortOption === "Date") return new Date(b.dateAdded) - new Date(a.dateAdded);
    if (sortOption === "Price") return a.price - b.price; // New price sorting
    return 0; // Default case
  });

  const handleCompleteTransaction = (item) => {
    setSelectedItemId(item.creationId); // Use the 'creationId' field inside the item object
    setCartId(item.cartId);
    setSelectedType(item.type);
    setPaymentRefId(item.paymentRef || ''); // Set the payment reference ID
    setScreenshot(null); // Reset screenshot
    setModalVisible(true); // Show the modal
  };


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable cropping or any editing
      quality: 1, // Keep the highest quality
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri); // Get the selected image URI
    }
  };

const handleSubmitTransaction = async () => {
  if (!payment_refId || !screenshot) {
    alert('Please provide a payment reference ID and upload a screenshot.');
    return;
  }

  if (!selectedItemId) {
    alert('No item selected. Please select an item to proceed.');
    return;
  }

  if (!selectedType) {
    alert('No type selected. Please select an item to proceed.');
    return;
  }

  setUploading(true);

  // Convert price to a number
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber)) {
    alert('Price must be a valid number.');
    return;
  }


  try {
    // Get the currently authenticated user
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      alert('No authenticated user. Please log in first.');
      return;
    }

    const { uid, email } = currentUser;

    // Generate a unique transaction ID
    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Upload the screenshot to Firebase Storage
    const fileName = `transactions/${transactionId}.jpg`;
    const storageRef = firebase.storage().ref().child(fileName);

    const response = await fetch(screenshot);
    const blob = await response.blob();

    // Upload the image
    await storageRef.put(blob);

    // Get the download URL
    const screenshotURL = await storageRef.getDownloadURL();

    // Write the transaction data to Firestore
    const transactionRef = await firebase.firestore().collection('transactions').add({
      transactionId,
      payment_refId,
      screenshotURL,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId: uid,
      clientEmail: email,
      selectedItemId, // Keeping reference to the selected item for the transaction
      selectedType,
      cartId,
      price: priceNumber, // Save price as a number
    });

    console.log('Transaction submitted. Document ID:', transactionRef.id);
    alert('Transaction successfully submitted!');

    // Reset states and close the modal
    setPaymentRefId('');
    setPrice(''); // Reset price field
    setScreenshot(null);
    setDownloadURL(null);
    setFirestoreID(transactionRef.id);
    setModalVisible(false);
  } catch (error) {
    console.error('Error submitting transaction:', error);
    alert('An error occurred while submitting the transaction.');
  } finally {
    setUploading(false);
  }
};


const downloadQRCode = async () => {
  if (isDownloading) {
    console.log('Download is already in progress. Please wait.');
    return; // Prevent overlapping calls
  }

  isDownloading = true; // Set lock

  try {
    // Create a reference to the Firebase Storage file
    const storageRef = ref(storage, 'qr/gcashMain.jpg'); // Reference to the 'gcashMain.png' file in Firebase Storage

    // Get the download URL for the file
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Download URL retrieved:', downloadUrl);

    // Open the download URL in the user's browser
    const result = await WebBrowser.openBrowserAsync(downloadUrl);

    if (result.type === 'cancel') {
      console.log('Browser closed by user.');
    } else {
      console.log('Browser opened successfully.');
    }
  } catch (error) {
    console.error('Error during download operation:', error);
    Alert.alert('Error', 'An error occurred while preparing the QR code for download.');
  } finally {
    isDownloading = false; // Always release the lock
  }
};
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Product Name: {item.name || 'N/A'}</Text>
        <Text style={styles.itemText}>Date Added: {item.dateAdded || 'N/A'}</Text>
        <Text style={styles.itemText}>Price: ${item.price ? (item.price / 100).toFixed(2) : 'N/A'}</Text>
        <Text style={styles.itemText}>Type: {item.type || 'N/A'}</Text>
        <Text style={styles.itemText}>Seller: {`${item.sellerFirstName || ''} ${item.sellerLastName || ''}`}</Text>
        <Text style={styles.itemText}>Seller Email: {item.sellerEmail || 'N/A'}</Text>

        {/* Conditional rendering of the "Payment Already Sent" warning with an icon beside the text */}
        {notifiedTransactions[item.id] && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              <Icon name="warning" size={20} color="#FF5733" style={styles.warningIcon} /> 
              <Text style={styles.warningTextContent}>Payment Already Sent</Text>
            </Text>
          </View>
        )}

          <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleCompleteTransaction(item)}
            disabled={disabledTransactions[item.id] || false} // Disable based on state
            style={[
              styles.button,
              {
                backgroundColor: disabledTransactions[item.id]
                  ? "#d3d3d3" // Gray for disabled
                  : "#9966CC", // Amethyst color for active
              },
            ]}
          >
            <Text style={styles.buttonText}>
              {disabledTransactions[item.id] ? "Completed" : "Complete Transaction"}
            </Text>
          </TouchableOpacity>


            <TouchableOpacity 
              onPress={() => handleDelete(item.id)} 
              style={[styles.button, { backgroundColor: '#800080' }]} // Single Amethyst color
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Header />
        
      <View style={styles.upperContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.productTypeContainer}>
          <Text style={styles.productTypeText}>YOUR HISTORY</Text>
        </View>
      </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.sortButton} onPress={() => {
            setSortOption(prevOption => 
              prevOption === "Date" ? "Price" : prevOption === "Price" ? "A-Z" : "Date");
          }}>
          <Icon name="filter" size={20} color="#E6E6FA" />
          <Text style={styles.sortText}>{sortOption}</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={sortedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh} // Attach refresh function
          refreshing={refreshing} // Attach refreshing state
        />

      {/* Modal for completing the transaction */}
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true} 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

          {/* Clickable Text to Open Instructions Modal */}
            <TouchableOpacity onPress={() => setInstructionModalVisible(true)}>
              <Text style={styles.instructionText}>How to upload a screenshot?</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Complete Transaction</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Enter Payment Gcash Reference ID" 
              value={payment_refId}
              onChangeText={setPaymentRefId}
              placeholderTextColor="#8A8A8A" // Gray for placeholder
            />

              <TextInput 
                style={styles.input} 
                placeholder="Enter Price" 
                value={price} // Add price state
                onChangeText={(value) => {
                  // Replace anything that is not a number or a decimal point
                  // Ensure only one decimal point is allowed
                  let newValue = value.replace(/[^0-9.]/g, ''); 
                  
                  // Only allow one decimal point
                  if ((newValue.split('.').length - 1) > 1) {
                    newValue = newValue.substring(0, newValue.lastIndexOf('.'));
                  }

                  setPrice(newValue);
                }} 
                placeholderTextColor="#8A8A8A" // Gray for placeholder
                keyboardType="numeric" // Numeric keyboard for better input experience
              />

            {/* Screenshot Picker as an Image */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
              {screenshot ? (
                <Image source={{ uri: screenshot }} style={styles.image} />
              ) : (
                <Text style={styles.imagePickerText}>Tap to pick a screenshot</Text>
              )}
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmitTransaction} 
              style={[styles.submitButton, uploading && styles.disabledButton]} 
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {uploading ? 'Processing...' : 'Pay'}
              </Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    <Modal 
      visible={instructionModalVisible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={() => setInstructionModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.instructionModalContainer}>
          <Text style={styles.instructionTitle}>How to Pay via GCash QR Code</Text>

          {/* Instructions */}
          <Text style={styles.instructionContent}>
            1. Open your GCash app.{'\n'}
            2. Tap "Scan QR" on the home screen of the app.{'\n'}
            3. Point your camera at the QR code displayed or download it{' '}
            <TouchableOpacity onPress={() => setQrModalVisible(true)}>
              <Text style={styles.clickableText}>here</Text>
            </TouchableOpacity>.{'\n'}
            4. Enter the exact payment amount and confirm the payment.{'\n'}
            5. Take a screenshot of the payment confirmation.{'\n'}
            6. Tap "Tap to pick a screenshot" in the transaction upload.{'\n'}
            7. Select the screenshot from your device's gallery.{'\n'}
            8. Submit the transaction once the screenshot is uploaded.{'\n'}
            9. Wait for the confirmation within 3 business days for your requested products or services.{'\n'}{'\n'}

              <Text style={{ fontWeight: 'bold' }}>Note:</Text> It should be both the Gcash 
              screenshot and email confirmation. Make sure to have exact money for Gcash transfer transaction.
          </Text>

          {/* Close Button */}
          <TouchableOpacity 
            onPress={() => setInstructionModalVisible(false)} 
            style={styles.closeButton}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <Modal 
        visible={qrModalVisible} 
        animationType="fade" 
        transparent={true} 
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContainer}>
            <Text style={styles.modalTitle}>Scan QR Code</Text>
            <Image 
              source={require('../assets/gcash.jpg')} // Replace with your QR code path
              style={styles.qrCodeImage} 
            />

            {/* Download Button */}
            <TouchableOpacity 
              onPress={downloadQRCode} 
              style={styles.downloadButton}
            >
              <Text style={styles.buttonText}>Download QR Code</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              onPress={() => setQrModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  backButtonText: {
    marginLeft: 5,
    color: '#555',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#E6E6FA',
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#9966CC",
    borderRadius: 8,
    minWidth: 85,
  },
  sortText: {
    marginLeft: 5,
    color: "#E6E6FA",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#E6E6FA",
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
  flex: 1,
  borderRadius: 8,
  marginHorizontal: 5,
  overflow: 'hidden', // To ensure rounded corners for gradient
  justifyContent: 'center', // Aligns children vertically
  alignItems: 'center', // Centers children horizontally
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    fontWeight: 'bold',
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  productTypeContainer: {
    flex: 1, // Allow productTypeContainer to take up remaining space
    marginLeft: 10,
    backgroundColor: '#9966CC', // Change the background color as needed
    borderRadius: 8, // Add rounded corners
    paddingVertical: 6, // Add vertical padding
    paddingHorizontal: 12, // Add horizontal padding
    alignItems: 'center', // Center text inside the container
    shadowColor: '#000', // Shadow properties
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  productTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },


  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333',
    elevation: 2, // Add shadow effect for elevation on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  modalContainer: {
    width: '80%', 
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
    color: '#333', // Dark text color for better contrast
  },
  closeButton: {
    backgroundColor: '#800080', // Red background for close button
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalBody: {
    width: '100%',
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: '#9966CC', // Green background
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  link: {
    marginTop: 16,
    color: 'blue',
  },
  id: {
    marginTop: 8,
    color: 'green',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD', // Disabled button color (gray)
  },
 imagePickerContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9', // Light background for the image picker
  },
  imagePickerText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#8A8A8A', // Gray text color for instructions
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  staticImage: {
    width: 80, // Adjust based on design
    height: 80,
    marginBottom: 20,
    alignSelf: 'center', // Center the image in the modal
    resizeMode: 'contain',
  },
  instructionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#4CAF50', // Green text to indicate it's clickable
    textDecorationLine: 'underline', // Underline to indicate interactivity
    marginBottom: 15,
    alignSelf: 'center',
  },
  instructionModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrCodeImage: {
    width: 150, // Adjust dimensions based on the QR code size
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  instructionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  instructionContent: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#555',
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 24, // Adjust for readability
  },
  clickableText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#4CAF50', // Green color to indicate interactivity
  },
  qrModalContainer: {
    width: '90%', // Increased width for a larger container
    backgroundColor: '#fff',
    borderRadius: 16, // Slightly rounded corners
    padding: 30, // Increased padding for a spacious layout
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Enhanced shadow for better visibility
    shadowOpacity: 0.2, // Slightly darker shadow
    shadowRadius: 10,
    elevation: 10, // Increased elevation for a raised effect
  },
  qrCodeImage: {
    width: 300, // Increased size for a larger QR code
    height: 300, // Keep it square
    marginBottom: 30, // Add more space below the QR code
    resizeMode: 'contain',
  },
downloadButton: {
  backgroundColor: '#4CAF50', // Green button color
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 20,
  marginBottom: 8,
},
buttonText: {
  color: '#fff',
  fontFamily: 'Poppins_400Regular',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
  warningContainer: {
    marginTop: 10,
    backgroundColor: '#FFDDC1', // Light red background for warning
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',  // This aligns the icon and text horizontally
    alignItems: 'center',  // Vertically centers the icon and text
  },
  warningIcon: {
    marginRight: 5, // Space between the icon and the text
  },
  warningText: {
    color: '#FF5733', // Bright red text for warning
    fontWeight: 'bold',
    fontSize: 14,  // You can adjust the font size as per your design
  },
  // This will add a margin between the icon and the text
  warningTextContent: {
    marginLeft: 10, // Add margin between the icon and the text content
  },
});

export default ClientHistory;
