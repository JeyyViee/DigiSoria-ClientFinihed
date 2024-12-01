import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ImageBackground, TextInput, Image, TouchableOpacity, Linking, Modal, Pressable, Alert } from 'react-native';
import { db, storage } from '../firebase/firebaseUserConfig';
import { collection, getDocs, getDoc, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import backgroundImage from '../assets/background.png';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedLoading, setCompletedLoading] = useState(null);
  const [loadingClient, setLoadingClient] = useState(false);
  const [loadingSeller, setLoadingSeller] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsCollection = collection(db, 'transactions');
        const snapshot = await getDocs(transactionsCollection);
        const transactionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

const filteredTransactions = transactions.filter(
  (transaction) =>
    transaction.SellerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
);


const toggleCompleted = async (id, currentValue) => {
  try {

    setCompletedLoading(id);
    const transactionDoc = doc(db, 'transactions', id);
    const transactionSnapshot = await getDoc(transactionDoc);
    const transactionData = transactionSnapshot.data();
    
    if (!transactionData) {
      console.error('Transaction not found');
      return;
    }
    
    // Step 1: Find the seller and client emails from the transaction
    const { SellerEmail, clientEmail } = transactionData;
    
    // Step 2: Look up the user(s) whose email matches either SellerEmail or clientEmail
    const usersRef = collection(db, 'users');
    const userQuery = query(
      usersRef,
      where('email', 'in', [SellerEmail, clientEmail])
    );
    
    const userSnapshot = await getDocs(userQuery);
    let completedTransactions = 0;
    
    userSnapshot.forEach(userDoc => {
      const userData = userDoc.data();
      
      if (userData.email === SellerEmail || userData.email === clientEmail) {
        completedTransactions = userData.completedTransactions || 0;
        
        // Update the completedTransactions count
        updateDoc(userDoc.ref, {
          completedTransactions: completedTransactions + 1,
        });
      }
    });

    // Step 3: Update the transaction's completed status
    await updateDoc(transactionDoc, { completed: !currentValue });
    
    // Step 4: Update the local state of transactions
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, completed: !currentValue }
          : transaction
      )
    );
  } catch (error) {
    console.error('Error updating completed status:', error);
  } finally {
    // Clear the loading state
    setCompletedLoading(null);
  }
};


  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

const sendToClientAndStore = async (item) => {
  try {
    setLoadingClient(true); 
    const { clientEmail, fileURL, transactionId, price, selectedType, selectedItemId } = item;

    if (!clientEmail) {
      Alert.alert("Error", "Client email is missing. Cannot send data.");
      return;
    }

    // Create the payload to send and store
    const payload = {
      clientEmail,
      fileURL,
      transactionId,
      price,
      selectedType,
      selectedItemId,
      sentAt: new Date(), // Timestamp of when the data is sent
    };

    // Store the details in Firestore
    const sentToClientsCollection = collection(db, 'sentToClients');
    await addDoc(sentToClientsCollection, payload);

    Alert.alert("Success", "File and details sent to the client and stored!");
  } catch (error) {
    console.error('Error sending to client and storing:', error);
    Alert.alert("Error", "Failed to send and store the details. Please try again.");
  } finally {
    setLoadingClient(false); // Stop loading
  }
};

const sendToSeller = async (item) => {
  try {
    setLoadingSeller(true);
    // Request permission to access the photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure only images are selected
      allowsEditing: true, // Optional: enable cropping or editing
      quality: 1, // Use high-quality images
    });

    // Handle case where user cancels image selection
    if (result.canceled) {
      Alert.alert('Cancelled', 'No image was selected.');
      return;
    }

    // Extract the selected image URI
    const imageUri = result.assets[0].uri; 
    const fileName = imageUri.split('/').pop(); // Generate file name from URI
    const storageRef = ref(storage, `sellerImages/${fileName}`);

    // Upload the image to Firebase Storage
    const response = await fetch(imageUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Send the image and details to the seller
    const { SellerEmail, price, transactionId } = item;
    const payload = {
      sellerEmail: SellerEmail,
      price,
      transactionId,
      fileURL: downloadURL,
      sentAt: new Date(), // Timestamp of when the data is sent
    };

    // Store the details in Firestore
    const sentToSellersCollection = collection(db, 'sentToSellers');
    await addDoc(sentToSellersCollection, payload);

    Alert.alert('Success', 'Image and details sent to the seller!');
  } catch (error) {
    console.error('Error sending to seller:', error);
    Alert.alert('Error', 'Failed to send image and details to the seller.');
  }
  finally {
    setLoadingSeller(false); // Stop loading
  }
};
  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />;
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.backgroundImage, { flex: 1 }]}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

    {/* Search Bar */}
    <TextInput
      style={styles.searchBar}
      placeholder="Search by Seller or Client Email"
      value={searchTerm}
      onChangeText={setSearchTerm}
    />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.transactionId}>Transaction ID: {item.transactionId}</Text>
            <Text>Price: ${item.price / 100}</Text>
          <TouchableOpacity
            style={[
              styles.completedButton,
              { backgroundColor: item.completed ? 'green' : 'red' },
            ]}
            onPress={() => toggleCompleted(item.id, item.completed)}
            disabled={completedLoading === item.id} // Disable the button if loading
          >
            {completedLoading === item.id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.completedButtonText}>
                {item.completed ? 'Completed' : 'Mark as Completed'}
              </Text>
            )}
          </TouchableOpacity>
            <Text>Type: {item.selectedType}</Text>
            <Text>Product UID: {item.selectedItemId}</Text>
            <View style={styles.separator} />

            <View style={styles.row}>
              {/* Client Section */}
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Client:</Text>
                <Text>Sent: {item.sent ? '✔️' : '❌'}</Text>
                <Text>Submitted At: {item.submittedAt?.toDate().toLocaleString()}</Text>
                <Text>Email: {item.clientEmail}</Text>
                <Text>Gcash Payment Ref: {item.payment_refId}</Text>
                {item.screenshotURL && (
                  <TouchableOpacity onPress={() => openModal(item.screenshotURL)}>
                    <Image
                      source={{ uri: item.screenshotURL }}
                      style={styles.thumbnailImage}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Seller Section */}
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Seller:</Text>
                <Text>Sent: {item.sent ? '✔️' : '❌'}</Text>
                <Text>Submitted At: {item.submittedAt?.toDate().toLocaleString()}</Text>
                <Text>Email: {item.SellerEmail || 'N/A'}</Text>
                <Text>Gcash: {item.Gcash || 'N/A'}</Text>
                {item.fileURL && (
                  <TouchableOpacity onPress={() => Linking.openURL(item.fileURL)}>
                    <Text style={styles.fileLink}>Download File</Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendToClientAndStore(item)}
                disabled={loadingClient} // Disable while loading
              >
                {loadingClient ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send to Client</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendToSeller(item)}
                disabled={loadingSeller} // Disable while loading
              >
                {loadingSeller ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send to Seller</Text>
                )}
              </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Modal for Viewing Screenshot */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            )}
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  transactionCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#E6E6FA',
  },
  transactionId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thumbnailImage: {
    marginTop: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  fileLink: {
    color: '#6200EE',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

sendButton: {
  marginTop: 10,
  padding: 10,
  backgroundColor: '#9966CC',
  borderRadius: 5,
  alignItems: 'center',
},
sendButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
searchBar: {
  height: 40,
  borderColor: '#ddd',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 16,
  backgroundColor: '#E6E6FA',
},

});

export default TransactionsList;
