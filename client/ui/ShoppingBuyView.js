import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, FlatList, ImageBackground, TextInput, } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import Header from '../../components/Header';

const ShoppingBuyView = ({
  product,
  creationDate,
  handleImagePress,
  handlePlayPauseAudio,
  handleStopAudio,
  downloadFile,
  handlePlayPauseVideo,
  handleVideoPlaybackStatus,
  playingStates,
  loading,
  videoRefs,
  styles,
  modalVisible,
  setModalVisible,
  selectedImage,
  sound,
  isSoundLoaded,
  bannerHeight,
  navigation,
  handleAddToCart,
  reviews,
  isAddingToCart,
  progressPercentage,
  setProgressPercentage,

}) => {
  // Local loading states for each media type
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingMusic, setLoadingMusic] = useState(true); 
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentLoadingStates, setDocumentLoadingStates] = useState(product.documents.map(() => false));
  const [loadingTracks, setLoadingTracks] = useState(Array(product.musics.length).fill(false));
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const backgroundImage = require('../../assets/background.png');
  const [isReviewLoading, setIsReviewLoading] = useState(true);

  
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

// Function to update progress
const updateProgress = () => {
  if (sound) {
    sound.getStatusAsync().then(status => {
      if (status.isLoaded && status.durationMillis > 0) {
        const currentTime = status.positionMillis;
        const duration = status.durationMillis;
        const progress = (currentTime / duration) * 100;
        setProgressPercentage(progress);
      }
    });
  }
};

// UseEffect for interval
useEffect(() => {
  let interval = null;

  if (isSoundLoaded && sound) {
    interval = setInterval(updateProgress, 1000); // Update every second
  } else {
    clearInterval(interval);
  }

  return () => clearInterval(interval);
}, [isSoundLoaded, sound]);

  useEffect(() => {
    // If reviews is undefined or still empty, keep the loading indicator on
    if (reviews && reviews.length > 0) {
      setIsReviewLoading(false); // Reviews are loaded, hide the loading indicator
    }
  }, [reviews]); // This effect will run whenever `reviews` changes

  // Modify your handlePlayPauseAudio function to control loadingMusic instead of loading
const handlePlayPauseAudioWithLoading = (musicUrl) => {
    setLoadingMusic(true); // Set music-specific loading state
    handlePlayPauseAudio(musicUrl);
    setLoadingMusic(false); // Reset music-specific loading state
  };

// Document press handler with loading state updates
const handleDocumentPress = async (doc, index) => {
  // Clone the loading states array and set the current document's state to true
  const newLoadingStates = [...documentLoadingStates];
  newLoadingStates[index] = true;
  setDocumentLoadingStates(newLoadingStates); // Set loading indicator for the current document

  try {
    // Attempt to download and open the document
    await downloadFile(doc, `Document_${index + 1}`);
    await WebBrowser.openBrowserAsync(doc);
  } catch (error) {
    // Display an error if the download or open fails
    Alert.alert('Error', 'Unable to download the document or open it.');
  } finally {
    // Reset loading state for the current document after it’s done
    newLoadingStates[index] = false;
    setDocumentLoadingStates([...newLoadingStates]); // Update state with reset loading indicator
  }
};

// Set initial document loading states when the product changes
useEffect(() => {
  setDocumentLoadingStates(new Array(product?.documents?.length).fill(false));
}, [product]);

useEffect(() => {
  if (product.images && product.images.length > 0) {
    const timer = setTimeout(() => {
      setLoadingImages(false);
    }, 500); // 500ms delay for staggered effect
    return () => clearTimeout(timer); // Cleanup timer
  }
}, [product.images]);

useEffect(() => {
  // Reset loading state whenever product changes
  setLoadingDocuments(true);
  setDocumentLoadingStates(new Array(product.documents.length).fill(false));
}, [product]);

const handleReviewNavigation = async (selectedItemId, productId, serviceId, productDocId) => {
  try {
    const db = getFirestore(); // Initialize Firestore
    const transactionRef = collection(db, 'transactions'); // Reference to the 'transaction' collection

    console.log('Checking transaction for selectedItemId:', selectedItemId);

    // Filter out null values and build a valid query
    const validIds = [productId, serviceId].filter((id) => id !== null);
    if (validIds.length === 0) {
      console.log('No valid productId or serviceId provided.');
      Alert.alert('Error', 'Invalid product or service selection.');
      return;
    }

    const q = query(transactionRef, where('selectedItemId', 'in', validIds));

    const querySnapshot = await getDocs(q);

    console.log('Query snapshot size:', querySnapshot.size);

    if (!querySnapshot.empty) {
      let matchedTransaction = null;
      let documentId = null;

      // Iterate through documents and find a completed transaction matching the selectedItemId
      querySnapshot.forEach((doc) => {
        const transaction = doc.data();

        if (transaction.completed && transaction.selectedItemId === selectedItemId) {
          matchedTransaction = transaction;
          documentId = doc.id; // Capture the document ID
        }
      });

      // If a matching completed transaction is found
      if (matchedTransaction) {
        console.log('Transaction is complete. Navigating to ProductReview.');

        navigation.navigate('ProductReview', {
          productId: selectedItemId, // Pass the selected item ID (productId or serviceId)
          serviceId, // Pass the original serviceId (or modify as needed)
          transactionId: documentId, // Pass the Firestore document ID of the transaction
          productDocId, // Pass the Firestore document ID of the product/service (from product.id)
        });
      } else {
        console.log('No completed transaction found for the selected item.');
        Alert.alert(
          'Review Not Allowed',
          'You can only review completed transactions for this item.'
        );
      }
    } else {
      console.log('No transaction matches the productId or serviceId.');
      Alert.alert('No Transaction Found', 'You need to at least add to cart before reviewing.');
    }
  } catch (error) {
    console.error('Error checking transaction:', error);
    Alert.alert('Error', 'An error occurred while checking the transaction.');
  }
};

  return (
 <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <Header/>
      <View style={styles.upperContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.productTypeContainer}>
          <Text style={styles.productTypeText}>
            DIGITAL {product.type === 'service' ? 'SERVICES' : 'PRODUCTS'}
          </Text>
        </View>
      </View>

      <ScrollView style={{ marginTop: 8 }}>
        <View style={{ paddingHorizontal: 16}}>
          <View style={styles.contentContainer}>
            <TouchableOpacity onPress={() => handleImagePress(product.imageUrl)} style={styles.imageContainer}>
              {loadingImages && <ActivityIndicator size="large" color="#0000ff" />}
              <Image source={{ uri: product.imageUrl }} style={[styles.productImage, { height: bannerHeight }]} onLoad={() => setLoadingImages(false)} />
            </TouchableOpacity>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.priceText}>Price: ${product.price / 100}</Text>
            <Text style={styles.sellerText}>Seller: {product.sellerName}</Text>
            <Text style={styles.typeText}>Type: {product.type || 'Unknown Type'}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.exclusiveText}>Category: </Text>
              <Text style={styles.categoryText}>
                {product.category === 'others'
                  ? `others/${product.files?.[0]?.fileType || 'Unknown Type'}`
                  : `${product.category || 'Unknown Category'}`}
              </Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.exclusiveText}>Description:</Text>
              <Text style={styles.descriptionText}>
                {product.description || 'No description available.'}
              </Text>
            </View>
            {product.type === 'service' && (
              <>
                <Text style={styles.detailText}>
                  Terms and Services: {'\n'}{product.terms || 'No terms provided'}
                </Text>

                <Text style={styles.detailText}>
                  Delivery Time: {product.deliveryTime || 'No delivery time provided'}
                </Text>
              </>
            )}
            {product.type === 'product' && (
              <>
                <Text style={styles.detailText}>
                  Stock: {product.stock || 'No stock information available'}
                </Text>

                <Text style={styles.detailText}>
                  Pricing and Licensing: {product.pricingAndLicensing || 'No pricing and licensing information provided'}
                </Text>
              </>
            )}
            <View style={styles.tagsContainer}>
              {product.tags && product.tags.length > 0 ? (
                product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noTagsText}>No tags available</Text>
              )}
            </View>
            <Text style={styles.smallDetailText}>
              ID: {product.type === 'product' ? product.productId : product.type === 'service' ? product.serviceId : 'No ID available'}
            </Text>
            <Text style={styles.smallDetailText}>Created At: {creationDate}</Text>
          </View>

        {/* Additional Images */}
        {product.images && product.images.length > 0 && (
          <View style={styles.additionalImagesContainer} >
            <View style={styles.additionalImagesHeader}>
              <Ionicons name="image-outline" size={20} color="black" />
              <Text style={styles.additionalImagesTitle}> Additional Images:</Text>
            </View>
            <FlatList
              data={product.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.additionalImagesFlatList}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleImagePress(item)}>
                  <Image
                    source={{ uri: item }}
                    style={styles.additionalImageItem}
                    onLoad={() => setLoadingImages(false)}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

      {/* Document Links */}
      {product?.documents?.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <View style={styles.iconTitleContainer}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text style={styles.subTitle}>Documents:</Text>
          </View>
          <View style={styles.documentsContainer}>
            {product.documents.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.documentCard}
                onPress={() => handleDocumentPress(doc, index)}
                activeOpacity={0.7}
              >
                <View style={styles.documentIconContainer}>
                  <Ionicons name="document-outline" size={30} color="#4A4A4A" />
                  {documentLoadingStates[index] && (
                    <View style={styles.documentLoadingOverlay}>
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Files Links */}
      {product?.files?.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <View style={styles.iconTitleContainer}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text style={styles.additionalImagesTitle}>Others:</Text>
          </View>

          <FlatList
            data={product.files}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.fileCard}
                onPress={async () => {
                  try {
                    const newLoadingStates = [...documentLoadingStates];
                    newLoadingStates[index] = true;
                    setDocumentLoadingStates(newLoadingStates);

                    // Pass item.url instead of item
                    await downloadFile(item.url, `File_${index + 1}`);
                    await WebBrowser.openBrowserAsync(item.url);
                  } catch (error) {
                    Alert.alert('Error', 'Unable to download the document or open it.');
                  } finally {
                    const finalLoadingStates = [...documentLoadingStates];
                    finalLoadingStates[index] = false;
                    setDocumentLoadingStates(finalLoadingStates);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.fileIconContainer}>
                  <Ionicons name="document-outline" size={40} color="#4A4A4A" style={styles.fileIcon} />
                  {documentLoadingStates[index] && (
                    <View style={styles.fileLoadingOverlay}>
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filesContainer}
          />
        </View>
      )}

        {product.videos && product.videos.length > 0 && (
        <View style={{ marginTop: 20 }}>
            <View style={styles.iconTitleContainer}>
              <Ionicons name="videocam-outline" size={24} color="black" />
              <Text style={styles.subTitle}> Video Previews:</Text>
            </View>
            {product.videos.map((videoUrl, index) => (
              <View key={index} style={styles.videoContainer}>
                {/* Video Title */}
                <Text style={styles.videoFileName}>{`Video ${index + 1}`}</Text>

                {/* Video and Loading Overlay */}
                <View style={styles.videoWrapper}>
                  {loadingVideos && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                  )}
                  <Video
                    ref={ref => (videoRefs.current[index] = ref)}
                    source={{ uri: videoUrl }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    onLoad={() => setLoadingVideos(false)}
                    onPlaybackStatusUpdate={status => handleVideoPlaybackStatus(status, index)}
                  />
                </View>

                {/* Play/Pause Button */}
                <View style={styles.controlsContainer}>
                  <TouchableOpacity onPress={() => handlePlayPauseVideo(index)}>
                    <Ionicons
                      name={playingStates[index] ? "pause-circle-outline" : "play-circle-outline"}
                      size={30}
                      color="#4CAF50"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

{product.musics && product.musics.length > 0 && (
  <View style={{ marginTop: 20 }}>
    <View style={styles.iconTitleContainer}>
      <Ionicons name="musical-notes-outline" size={24} color="black" />
      <Text style={styles.subTitle}>Music Previews:</Text>
    </View>

    {product.musics.map((musicUrl, index) => (
      <View key={index} style={styles.musicPlayerContainer}>
        <View style={styles.musicPlayerHeader}>
          <Text style={[styles.trackTitle, styles.coolFont]}>
            {`Track ${index + 1}`}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={() => handlePlayPauseAudio(musicUrl)}
            disabled={loading || (sound && sound._uri === musicUrl)}
          >
            <Ionicons
              name={sound && sound._uri === musicUrl ? "pause-circle" : "play-circle"}
              size={40}
              color="#4CAF50"
            />
          </TouchableOpacity>

          {/* Display loading indicator while track is loading */}
          {loading && (
            <ActivityIndicator size="small" color="#4CAF50" style={styles.loadingIndicator} />
          )}

          <TouchableOpacity
            onPress={handleStopAudio}
            disabled={!isSoundLoaded || loading}
          >
            <Ionicons name="stop-circle" size={40} color="#f44336" />
          </TouchableOpacity>

          <View style={styles.seekBarContainer}>
            <View style={styles.seekBar}>
              <View style={[styles.seekProgress, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>
      </View>
    ))}
  </View>
)}

      <Text style={styles.reviewsHeader}>Reviews:</Text>
      {/* Show Distinct Loading Indicator if loading */}
      {isReviewLoading ? (
        <DistinctLoadingIndicator />
      ) : reviews && reviews.length > 0 ? (
        <View style={styles.reviewsContainer}>
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {reviews.map((item, index) => (
              <View key={item.id || index} style={styles.reviewItem}>
                {/* Reviewer info */}
                <View style={styles.reviewerInfo}>
                  {item.userProfile?.profilePic ? (
                    <Image source={{ uri: item.userProfile.profilePic }} style={styles.profileIcon} />
                  ) : (
                    <View style={[styles.profileIcon, styles.defaultProfileIcon]} />
                  )}
                  <View style={styles.nameAndDateContainer}>
                    <Text style={styles.reviewerName}>
                      {item.userProfile?.firstName && item.userProfile?.lastName
                        ? `${item.userProfile.firstName} ${item.userProfile.lastName}`
                        : `User ${index + 1}`}
                    </Text>
                    <Text style={[styles.dateText, { marginLeft: 4 }]}>
                      {new Date(item.date.seconds * 1000).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                </View>

                {/* Comment */}
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <NoReviewsMessage />
      )}

          {/* Image Modal */}
          <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedImage && (
                  <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>

    <View style={styles.lowerButtonContainer}>
      <TouchableOpacity style={[styles.addToCartButton, isAddingToCart && styles.addingToCartButton]} onPress={handleAddToCart} disabled={isAddingToCart}>
        {isAddingToCart ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" style={styles.cartSpinner} />
            <Text style={styles.loadingText}>Adding...</Text>
          </View>
        ) : (
          <Text style={styles.addToCartText}>Add to Cart</Text>
        )}
      </TouchableOpacity>
    
{/* Write a Review Button */}
<TouchableOpacity
  style={styles.reviewButton}
  onPress={() => {
    // Determine which ID to pass
    const selectedId = product.productId || product.serviceId; // Use productId if available, else serviceId
    const productDocId = product.id; // Get the product document ID

    console.log('Handling review navigation for:', {
      selectedItemId: selectedId,
      productId: product.productId,
      serviceId: product.serviceId,
      id: product.id, // Product document ID
    });

    // Call the function to handle navigation, passing both selectedItemId and productDocId
    handleReviewNavigation(selectedId, product.productId, product.serviceId, productDocId);
  }}
>
  <View style={styles.icon}>
    <Entypo name="pencil" size={18} color="#800080" />
  </View>
</TouchableOpacity>

{/* Message Seller Button */}
<TouchableOpacity
  style={styles.messageButton}
  onPress={() => navigation.navigate('Message', { sellerId: product.sellerId, sellerEmail: product.sellerEmail })} // Pass both sellerId and sellerEmail
>
  <View style={styles.icon}>
    <MaterialIcons name="message" size={18} color="#800080" />
  </View>
</TouchableOpacity>



    </View>
      </View>
    </View>
  </ImageBackground>
  );
};

export default ShoppingBuyView;
