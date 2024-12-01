import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, firebase } from '../firebase/firebaseUserConfig';
import { doc, updateDoc, arrayUnion, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import Header from '../components/Header';

const ProductReview = ({ route, navigation }) => {
  const { productId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [ratingText, setRatingText] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State for user's email 
  const [firstName, setFirstName] = useState(''); // State for user's first name
  const [lastName, setLastName] = useState(''); // State for user's last name
  const [profilePic, setProfilePic] = useState(''); // State for user's profile picture
  const backgroundImage = require('../assets/background.png');

  const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;

  useEffect(() => {
    const checkIfReviewed = async () => {
      try {
        if (!userId) return;
        const q = query(
          collection(db, 'service_productReport'),
          where('productId', '==', productId),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        setHasReviewed(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking review status:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId))); // Adjust collection name as needed
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            setUserEmail(firebase.auth().currentUser.email); // Get the user's email
            setFirstName(userData.firstName); // Get the user's first name
            setLastName(userData.lastName); // Get the user's last name
            setProfilePic(userData.profilePic); // Get the user's profile picture URL
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    checkIfReviewed();
    fetchUserProfile(); // Call to fetch user profile information
  }, [productId, userId]);

  const handleRatingPress = (value) => {
    setRating(value);
    const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    setRatingText(ratingLabels[value - 1]);
  };

const handleReviewSubmit = async (id, selectedItem) => {
    // Check for required fields
    if (!productId || !userId || !userEmail || !firstName || !lastName || rating === undefined || comment === undefined) {
        Alert.alert('Error', 'Your profile is not yet set up. Please complete it first.');
        return;
    }
    if (rating === 0) {
        Alert.alert('Please select a rating.');
        return;
    }
    if (comment.length > 200) {
        Alert.alert('Review cannot exceed 200 characters.');
        return;
    }
    if (hasReviewed) {
        Alert.alert('You have already reviewed this product/service.');
        return;
    }

    // Ensure selectedItem has a valid value, else provide a fallback value
    const validSelectedItem = selectedItem || 'unknown'; // Use 'unknown' as fallback if selectedItem is undefined

    setIsLoading(true);
    try {
        // Prepare the review data
        const reviewData = {
            productId,
            userId,
            userEmail,
            firstName,
            lastName,
            rating,
            comment,
            date: new Date(),
            selectedItem: validSelectedItem, // Use the validated selectedItem
        };

        // Only add profilePic if it's defined
        if (profilePic) {
            reviewData.profilePic = profilePic; // Only add if it's a valid value
        }

        // Add the review to the Firestore collection
        const reportRef = await addDoc(collection(db, 'service_productReport'), reviewData);


        Alert.alert('Thank you for your review!');
        navigation.goBack();
    } catch (error) {
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Unable to submit your review. Please try again later.');
    } finally {
        setIsLoading(false);
    }
};


  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <Header />
      <View style={styles.upperContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.productTypeContainer}>
          <Text style={styles.productTypeText}>RATE</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Rate this Product/Service</Text>

        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => handleRatingPress(value)}>
              <Ionicons
                name="star"
                size={36}
                color={rating >= value ? '#C8A2D3' : '#E0E0E0'}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>{ratingText}</Text>

        {/* Comment Input */}
        <TextInput
          style={styles.commentInput}
          placeholder="Write a detailed review... (max 200 characters)"
          value={comment}
          onChangeText={(text) => setComment(text.slice(0, 200))}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, hasReviewed ? styles.disabledButton : null]}
          onPress={handleReviewSubmit}
          disabled={isLoading || hasReviewed}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{hasReviewed ? 'Already Reviewed' : 'Submit Review'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  ratingContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  star: { marginHorizontal: 5 },
  ratingText: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 20 },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    height: 120,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#9966CC',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  disabledButton: { backgroundColor: '#A9A9A9' },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
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
    backgroundColor: '#e0e0e0', // Change the background color as needed
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
    color: '#4B0082', // Change to your desired color
  },
});

export default ProductReview;
