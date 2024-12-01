import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons for the bell icon
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase/firebaseUserConfig'; // Import your Firebase auth and db configuration

// Import your logo image
import logo from '../assets/Logo.png'; // Adjust the path as needed

const Header = ({ title }) => {
  const [userEmail, setUserEmail] = useState(null); // State to store the user's email
  const [userRole, setUserRole] = useState(null); // State to store the user's role (Client/Seller)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0); // State for unread notifications count
  const navigation = useNavigation(); // Get navigation instance

  // Fetch the current user's email and role using Firebase Auth and Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the email of the logged-in user
        console.log('Current user email:', user.email); // Log the email
        fetchUserRole(user.email); // Fetch the role from Firestore
      } else {
        console.log('No user is logged in');
      }
    });

    return unsubscribe; // Cleanup the listener when the component unmounts
  }, []);

  // Fetch user role from the Firestore 'users' collection based on the email
  const fetchUserRole = (email) => {
    db.collection('users')
      .where('email', '==', email) // Match the email field in the 'users' collection
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const role = userDoc.data().role; // Get the role from the document
          setUserRole(role); // Set the user's role (Client/Seller or others)
          console.log('User role:', role); // Log the role for debugging
          fetchUnreadNotifications(email, role); // Fetch notifications based on role
        } else {
          console.log('User not found in Firestore');
        }
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  };

// Fetch unread notifications count from Firestore based on the user's role
const fetchUnreadNotifications = (email, role) => {
  let collectionName = '';
  let userEmailField = '';

  if (role === 'Client') {
    collectionName = 'sentToClients'; // For Client notifications
    userEmailField = 'clientEmail';
  } else if (role === 'Seller') {
    collectionName = 'sentToSellers'; // For Seller notifications
    userEmailField = 'sellerEmail';
  }

  if (collectionName && userEmailField) {
    const unsubscribe = db.collection(collectionName)
      .where(userEmailField, '==', email) // Match the email based on the role
      .where('markRead', '==', false) // Only fetch unread notifications
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const unreadCount = querySnapshot.size; // Count unread notifications
          setUnreadNotificationsCount(unreadCount); // Update the state
          console.log(`Unread notifications for ${role}: ${unreadCount}`);
        } else {
          setUnreadNotificationsCount(0); // Reset count if no unread notifications
          console.log(`No unread notifications for ${role}.`);
        }
      }, (error) => {
        console.error(`Error fetching unread notifications for ${role}:`, error);
      });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }
};

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.leftSection}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Bell Icon with Notification Badge */}
<TouchableOpacity
  onPress={() => {
    console.log('Navigating to Notifications with email:', userEmail);
    if (userRole === 'Seller') {
      // Navigate to the Seller's notification screen
      navigation.navigate('NotificationSeller', { email: userEmail });
    } else {
      // Default: Navigate to the Client's notification screen
      navigation.navigate('NotificationClient', { email: userEmail });
    }
  }}
>

        <View style={styles.notificationIconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadNotificationsCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'lavender', // Soft lavender background for a clean look
    alignItems: 'center', // Centers all items vertically
    flexDirection: 'row', // Align logo, title, and icons side by side
    justifyContent: 'space-between', // Ensure there's space between the elements
    elevation: 10, // Elevation for subtle shadow effect
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.1, // Light shadow opacity
    shadowRadius: 10, // More diffuse shadow
  },
  leftSection: {
    flexDirection: 'row', // Logo and Title should be aligned horizontally
    alignItems: 'center', // Vertically align the logo and title
  },
  title: {
    fontSize: 22, // Larger title for better readability
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15, // Space between logo and title
  },
  logo: {
    width: 90, // Adjust the size of the logo
    height: 45, // Adjust the height of the logo
  },
  notificationIconContainer: {
    position: 'relative', // Required for positioning the badge on top of the icon
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
