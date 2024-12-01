import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { getAuth } from "firebase/auth";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'; // Import the hook
import AdminItemView from './ui/AdminItemViewUI.js';
import styles from './styles/AdminItemView.style.js'
import { useNavigation } from '@react-navigation/native';
import { db } from "../firebase/firebaseUserConfig"; 
import { getStorage, ref, deleteObject } from 'firebase/storage';


const AdminItem = ({ route }) => {
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
  const [featuring, setFeaturing] = useState(false);


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


const hideProduct = async () => {
  try {
    const productId = product.id; // Assuming product.id uniquely identifies the product

    // 1. Update the product document in Firestore to include or set 'hidden' to true
    await db.collection('products_services').doc(productId).update({
      hidden: true,
    });

    // 2. Prepare the notification data for the `sentToSeller` collection
    const notificationData = {
      email: product.sellerEmail, // Assuming `sellerEmail` exists in the product object
      serviceId: productId, // Using productId as the serviceId
      name: product.name, // Assuming `name` exists in the product object
      uid: product.uid, // Assuming `sellerUid` exists in the product object
      reason: `The item "${product.name}" is hidden because of inappropriate content, false information, or product/services mismatch. Please contact the admin for an appeal.`,
      date: new Date().toISOString(), // Capture the current date and time
    };

    // 3. Add the notification to the 'sentToSeller' collection
    await db.collection('sentToSellers').add(notificationData);

    console.log('Notification sent to seller:', notificationData);

    // 4. Show success alert
    Alert.alert('Success', 'Product has been successfully hidden.');
    navigation.goBack(); // Optionally navigate back to the previous screen
  } catch (error) {
    console.error('Error hiding product:', error);
    Alert.alert('Error', 'There was an error hiding the product.');
  }
};


const handleHidePress = () => {
  Alert.alert(
    'Confirm Action',
    'Are you sure you want to hide this item?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Hide', onPress: hideProduct },
    ]
  );
};

const unhideProduct = async () => {
  try {
    const productId = product.id; // Assuming product.id uniquely identifies the product

    // 1. Update the product document in Firestore to set 'hidden' to false
    await db.collection('products_services').doc(productId).update({
      hidden: false,
    });

    // 2. Find and delete the corresponding document in the 'sentToSellers' collection
    const sentToSellersQuery = await db
      .collection('sentToSellers')
      .where('serviceId', '==', productId)
      .get();

    if (!sentToSellersQuery.empty) {
      const batch = db.batch();
      sentToSellersQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit(); // Delete all matching documents
      console.log(`Notification removed for product with ID: ${productId}`);
    } else {
      console.log(`No notification found for product with ID: ${productId}`);
    }

    // 3. Show success alert
    Alert.alert('Success', 'Product has been successfully unhidden.');
    navigation.goBack(); // Optionally navigate back to the previous screen
  } catch (error) {
    console.error('Error unhiding product:', error);
    Alert.alert('Error', 'There was an error unhiding the product.');
  }
};

const handleUnhidePress = () => {
  Alert.alert(
    'Confirm Action',
    'Are you sure you want to unhide this item?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unhide', onPress: unhideProduct },
    ]
  );
};

const featureProduct = async () => {
  setFeaturing(true); // Start loading
  try {
    const productId = product.id; // Assuming product.id uniquely identifies the product
    const isCurrentlyFeatured = product.isFeatured; // Get current feature status

    // 1. Update the product's `isFeatured` and `isRecommended` status in Firestore
    await db.collection('products_services').doc(productId).update({
      isFeatured: !isCurrentlyFeatured,
      isRecommended: !isCurrentlyFeatured, // Synchronize with isFeatured
    });

    if (!isCurrentlyFeatured) {
      // 2a. Add a notification document to `sentToSellers` collection when featured
      const notificationData = {
        email: product.sellerEmail, // Assuming `sellerEmail` exists in the product object
        serviceId: productId, // Using productId as the serviceId
        name: product.name, // Assuming `name` exists in the product object
        uid: product.uid, // Assuming `uid` exists in the product object
        reason: `The item "${product.name}" has been marked as Featured. Congratulations! Your product/service is now highlighted.`,
        date: new Date().toISOString(), // Capture the current date and time
      };

      await db.collection('sentToSellers').add(notificationData);
      console.log('Notification sent for featured product:', notificationData);
    } else {
      // 2b. Remove the corresponding document in `sentToSellers` if unfeatured
      const sentToSellersQuery = await db
        .collection('sentToSellers')
        .where('serviceId', '==', productId)
        .where(
          'reason',
          '==',
          `The item "${product.name}" has been marked as Featured. Congratulations! Your product/service is now highlighted.`
        )
        .get();

      if (!sentToSellersQuery.empty) {
        const batch = db.batch();
        sentToSellersQuery.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit(); // Delete all matching documents
        console.log(`Notification removed for unfeatured product with ID: ${productId}`);
      }
    }

    // 3. Update local state or trigger UI refresh
    product.isFeatured = !isCurrentlyFeatured;
    product.isRecommended = !isCurrentlyFeatured; // Update local state
    console.log(
      `Product successfully ${!isCurrentlyFeatured ? 'featured and recommended' : 'unfeatured and unrecommended'}.`
    );

    // 4. Show success alert
    Alert.alert(
      'Success',
      `Product has been successfully ${
        !isCurrentlyFeatured ? 'featured and recommended' : 'unfeatured and unrecommended'
      }.` 
    );
    navigation.goBack(); // Optionally navigate back to the previous screen
  } catch (error) {
    console.error('Error updating feature status:', error);
    Alert.alert('Error', 'There was an error updating the feature status.');
  } finally {
    setFeaturing(false); // End loading
  }
};

const handleFeaturePress = () => {
  Alert.alert(
    'Confirm Action',
    `Are you sure you want to ${
      product.isFeatured ? 'unfeature' : 'feature'
    } this item?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: product.isFeatured ? 'Unfeature' : 'Feature', onPress: featureProduct },
    ]
  );
};


  return (
    <AdminItemView
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
      navigation={navigation}
      reviews={reviews}
      isAddingToCart={isAddingToCart}
      progressPercentage={progressPercentage}
      setProgressPercentage={setProgressPercentage} 
      onHide={handleHidePress}
      onUnhide={handleUnhidePress}
      featureProduct={featureProduct}
      handleFeaturePress={handleFeaturePress}
    />

  );
};
export default AdminItem;
