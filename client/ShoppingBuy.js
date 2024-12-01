import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, } from 'react-native';
import { getAuth } from "firebase/auth";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'; // Import the hook
import ShoppingBuyView from '../client/ui/ShoppingBuyView.js';
import styles from '../client/styles/shoppingbuy.styles.js'
import { getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from "../firebase/firebaseUserConfig"; 



const ShoppingBuy = ({ route }) => {
  const { product } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const videoRef = useRef(null); // Using ref for video controls
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const videoRefs = useRef([]); // Array to hold video refs
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState(''); // Ensure this is correctly declared
  const [playingIndex, setPlayingIndex] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null); // Store your audio player reference
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const [sound, setSound] = useState(null); // To store the sound object
  const [isSoundLoaded, setIsSoundLoaded] = useState(false); // Track if the sound is loaded
  const [playingStates, setPlayingStates] = useState([]); // Track playing state for each video
  const [loading, setLoading] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const bannerHeight = 250; // Adjust as needed
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loadingArray, setLoadingArray] = useState([]); // Array to track loading state for each track
  const [progressArray, setProgressArray] = useState([]); // Array to track progress for each track


  // Handle image preview modal
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

const fetchReviews = async () => {
  try {
    if (!db || !db.collection) {
      console.error("Firestore is not initialized correctly.");
      return;
    }

    // Fetch the service document based on the serviceId or another identifier
    const serviceDoc = await db.collection('products_services').doc(product.id).get();

    if (!serviceDoc.exists) {
      console.error("Service document not found.");
      return;
    }

    // Fetch reviews from the reviews array inside the service document
    const serviceData = serviceDoc.data();
    const reviewsIds = serviceData.reviews || [];

    // Fetch all the reviews documents using the review IDs
    const reviewsCollection = await Promise.all(reviewsIds.map(async (reviewId) => {
      const reviewDoc = await db.collection('service_productReport').doc(reviewId).get();

      if (reviewDoc.exists) {
        const review = { id: reviewDoc.id, ...reviewDoc.data() };

        // Fetch user profile if `userId` is available in the review document
        if (review.userId) {
          const userDoc = await db.collection('users').doc(review.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            review.userProfile = {
              firstName: userData.firstName || "Anonymous", // Default to "Anonymous" if no first name
              lastName: userData.lastName || "User", // Default to "User" if no last name
              profilePic: userData.profilePic || null, // Default to null if no profilePic
            };
          } else {
            // Handle case where user document does not exist
            review.userProfile = {
              firstName: "Anonymous",
              lastName: "User",
              profilePic: null,
            };
          }
        }

        return review;
      }
    }));

    // Filter out undefined reviews (in case some review IDs don't exist)
    const reviewsData = reviewsCollection.filter(review => review !== undefined);

    // Set the fetched reviews
    setReviews(reviewsData);
  } catch (error) {
    console.error("Error fetching reviews: ", error);
  }
};

// Call fetchReviews when the component mounts or product.id changes
useEffect(() => {
  fetchReviews();
}, [product.id]);


const downloadFile = async (fileUrl, fileName) => {
  try {
    if (!fileUrl || !fileName) throw new Error('Invalid file URL or file name');

    const directoryPath = FileSystem.documentDirectory;
    const dirInfo = await FileSystem.getInfoAsync(directoryPath);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
    }

    const fileUri = `${directoryPath}${fileName}`;
    const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);

    console.log('Download completed:', uri);
  } catch (error) {
    console.error('Download failed:', error);
    Alert.alert('Download failed', error.message);
  }
};

  const creationDate = product.createdAt 
    ? new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown';

  // Track isFocused status
  useEffect(() => {
    if (isFocused && playingIndex !== null) {
      // Re-load the audio when coming back to the screen if there was a previous playing index
      handlePlayPauseAudio(musicUrlList[playingIndex], playingIndex);
    } else {
      // Unload audio when leaving screen
      handleStopAudio();
    }
  }, [isFocused]);

  const handlePlayPauseVideo = async (index) => {
    const isCurrentlyPlaying = playingStates[index];

    if (isCurrentlyPlaying) {
      await videoRefs.current[index].pauseAsync();
    } else {
      await videoRefs.current[index].playAsync();
    }

    // Update the specific video's playing state
    const newPlayingStates = [...playingStates];
    newPlayingStates[index] = !isCurrentlyPlaying;
    setPlayingStates(newPlayingStates);
  };

  const handleVideoPlaybackStatus = (status, index) => {
    if (status.didJustFinish) {
      // Replay the video once it's finished
      videoRefs.current[index].replayAsync();
    }

    // Update play/pause state for the video
    const newPlayingStates = [...playingStates];
    newPlayingStates[index] = status.isPlaying;
    setPlayingStates(newPlayingStates);
  };

  // Pause all videos when component unmounts or focus changes
  useEffect(() => {
    return () => {
      // Pause all videos on component unmount
      videoRefs.current.forEach(async (videoRef) => {
        if (videoRef) {
          await videoRef.pauseAsync(); // Ensure each video is paused
        }
      });
    };
  }, []);

  // Stop and unload audio when not focused
  useEffect(() => {
    if (!isFocused) {
      // Pause all videos when the screen loses focus
      videoRefs.current.forEach(async (videoRef) => {
        if (videoRef) {
          await videoRef.pauseAsync(); // Ensure the video is paused
        }
      });
    }
  }, [isFocused]);


  const handlePlayPauseAudio = async (musicUrl, index) => {
    try {
      // Return immediately if the sound is loading
      if (loading) return;

      if (playingIndex === index) {
        // If the same music is playing, pause it
        if (sound && isSoundLoaded) {
          await sound.pauseAsync();
        }
        setPlayingIndex(null);
      } else {
        // Stop and unload the previous sound if it exists
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setIsSoundLoaded(false);
        }

        // Set loading state while loading the new sound
        setLoading(true);

        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: musicUrl },
          { shouldPlay: true } // Attempt immediate playback after loading
        );

        // Verify that the sound loaded successfully
        if (status.isLoaded) {
          setSound(newSound);
          setIsSoundLoaded(true);
          setPlayingIndex(index);

          // Set up a listener to update progress
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              if (status.isPlaying) {
                const progress = (status.positionMillis / status.durationMillis) * 100;
                setProgressPercentage(progress);
              } else if (status.didJustFinish) {
                setProgressPercentage(0); // Reset progress when finished
              }
            }
          });
        } else {
          console.error("Error: Sound did not load correctly.");
        }

        // Reset loading state
        setLoading(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setLoading(false);
    }
  };

  // Example handleStopAudio function
  const handleStopAudio = async () => {
    if (sound && isSoundLoaded) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null); // Reset sound state
      setIsSoundLoaded(false); // Reset loaded state
      setPlayingIndex(null); // Reset playing index
      setProgressPercentage(0); // Reset progress when stopped
    }
  };

  // Ensure the sound stops and unloads when not focused
  useEffect(() => {
    if (!isFocused && sound && isSoundLoaded) {
      sound.stopAsync();
      sound.unloadAsync();
      setPlayingIndex(null);
      setIsSoundLoaded(false);
      setProgressPercentage(0); // Reset progress when not focused
    }
  }, [isFocused, sound, isSoundLoaded]);

  // Clean up the sound on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);


  const bannerTransform = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, bannerHeight],
          outputRange: [0, -bannerHeight / 2], // Creates a parallax effect
          extrapolate: 'clamp',
        }),
      },
    ],
  };

const handleAddToCart = async () => {
  setIsAddingToCart(true);
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      setIsAddingToCart(false);
      return;
    }

    const sellerId = product.uid;
    if (!sellerId) {
      Alert.alert("Error", "Product seller ID is missing. Please check the product details.");
      setIsAddingToCart(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      Alert.alert("Error", "User details not found.");
      setIsAddingToCart(false);
      return;
    }

    const sellerDocRef = doc(db, "users", sellerId);
    const sellerDoc = await getDoc(sellerDocRef);

    if (!sellerDoc.exists()) {
      Alert.alert("Error", "Seller details not found.");
      setIsAddingToCart(false);
      return;
    }

    const userData = userDoc.data();
    const sellerData = sellerDoc.data();

    const cartItem = {
      name: product.name,
      dateAdded: new Date().toISOString(),
      price: product.price,
      type: product.type,
      userEmail: user.email,
      userId: user.uid,
      firstName: userData.firstName || "Unknown",
      lastName: userData.lastName || "Unknown",
      sellerFirstName: sellerData.firstName || "Unknown",
      sellerLastName: sellerData.lastName || "Unknown",
      sellerEmail: sellerData.email || "Unknown",
      creationId: product.type === "product" ? product.productId ?? null : product.serviceId ?? null,
    };

    // Add to cart collection
    const docRef = await addDoc(collection(db, "cart"), cartItem);

    // Update the document to include its Firestore document ID
    await updateDoc(docRef, { cartId: docRef.id });

    if (product.type === "product") {
      console.log("Product ID for stock:", product.productId);

      // Create a query to find the product document where the productId matches
      const productQuery = query(
        collection(db, "products_services"),
        where("productId", "==", product.productId) // Matching productId field
      );

      const querySnapshot = await getDocs(productQuery);

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0]; // Get the first document that matches the query
        const productData = productDoc.data();
        console.log("Product document data:", productData);

        // Convert the stock to an integer for calculation
        const currentStock = parseInt(productData.stock, 10) || 0; // Default to 0 if invalid

        if (currentStock > 0) {
          // Decrement stock by 1 and store it back as a string
          await updateDoc(productDoc.ref, {
            stock: (currentStock - 1).toString(), // Save back as a string
          });
        } else {
          Alert.alert("Out of Stock", "This product is no longer available.");
          setIsAddingToCart(false);
          return;
        }
      } else {
        console.error("No product document found with productId:", product.productId);
        Alert.alert("Error", "Product details not found.");
        setIsAddingToCart(false);
        return;
      }
    }

    // Add notification to sentToClient collection
    const notification = {
      message: `You've successfully added ${product.name} to your cart!`,
      productId: product.productId,
      cartId: docRef.id,
      sellerId: sellerId,
      clientId: user.uid,
      timestamp: new Date().toISOString(),
      read: false,  // Mark the notification as unread
    };

    // Add notification to sentToClient collection for the seller
    await addDoc(collection(db, "sentToClients"), notification);

    // Navigate to ClientHistory and pass the cartId
    navigation.navigate("ClientHistory", { cartId: docRef.id });
    Alert.alert("Success", "Product added to cart!");

  } catch (error) {
    console.error("Error adding to cart:", error);
    Alert.alert("Error", "Could not add to cart.");
  } finally {
    setIsAddingToCart(false); // Stop loading after process completion
  }
};

const DistinctLoadingIndicator = () => (
  <View style={styles.distinctLoadingContainer}>
    <ActivityIndicator size="large" color="#9966CC" />
  </View>
);

const NoReviewsMessage = () => (
  <View style={styles.noReviewsContainer}>
    <Text style={styles.noReviewsText}>No reviews available right now.</Text>
  </View>
);

  return (
    <ShoppingBuyView
      product={product}
      creationDate={creationDate}
      handleImagePress={handleImagePress}
      handlePlayPauseAudio={handlePlayPauseAudio}
      handleStopAudio={handleStopAudio}
      downloadFile={downloadFile}
      handlePlayPauseVideo={handlePlayPauseVideo}
      handleVideoPlaybackStatus={handleVideoPlaybackStatus}
      playingStates={playingStates}
      loading={loading}
      videoRefs={videoRefs}
      styles={styles}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      sound={sound} // Pass the sound object
      isSoundLoaded={isSoundLoaded} // Pass the sound loaded state
      selectedImage={selectedImage}
      bannerTransform={bannerTransform}
      scrollY={scrollY}
      bannerHeight={bannerHeight}
      handleAddToCart={handleAddToCart}
      navigation={navigation}
      reviews={reviews}
      isAddingToCart={isAddingToCart}
      progressPercentage={progressPercentage}
      setProgressPercentage={setProgressPercentage} 
      DistinctLoadingIndicator={DistinctLoadingIndicator}
      NoReviewsMessage={NoReviewsMessage}
    />

  );
};
export default ShoppingBuy;
