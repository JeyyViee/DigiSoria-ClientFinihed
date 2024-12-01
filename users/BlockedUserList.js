import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Image, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { firebase } from '../firebase/firebaseUserConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import backgroundImage from '../assets/background.png';

function BlockedUsersList() {
  const navigation = useNavigation();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingUserId, setUnblockingUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      fetchBlockedUsers(user.uid);
    } else {
      console.error("No authenticated user.");
    }
  }, []);

  const fetchBlockedUsers = async (userId) => {
    setLoading(true);
    try {
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.error("User document not found for ID:", userId);
        return; // Exit if the user document doesn't exist
      }

      const userData = userDoc.data();
      if (userData && userData.blockedUsers && userData.blockedUsers.length > 0) {
        const blockedUserIds = userData.blockedUsers;

        const blockedUsersPromises = blockedUserIds.map(async (blockedUserId) => {
          const blockedUserDoc = await firebase.firestore().collection('users').doc(blockedUserId).get();
          return blockedUserDoc.exists ? { id: blockedUserId, ...blockedUserDoc.data() } : null;
        });

        const blockedUsersDocs = await Promise.all(blockedUsersPromises);
        const blockedUsersList = blockedUsersDocs.filter(user => user);
        setBlockedUsers(blockedUsersList);
      } else {
        setBlockedUsers([]); // Ensure the state is reset if no blocked users are found
      }
    } catch (error) {
      console.error("Error fetching blocked users: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
      setRefreshing(false); // Stop refreshing
    }
  };

  const handleUnblockUser = async (userId) => {
    setUnblockingUserId(userId); // Set the user ID being unblocked
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error("No authenticated user.");
        return;
      }

      const userDocRef = firebase.firestore().collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        console.error("User document not found for unblocking.");
        Alert.alert('Error', 'Your account data was not found.');
        return;
      }

      await userDocRef.update({
        blockedUsers: firebase.firestore.FieldValue.arrayRemove(userId)
      });

      Alert.alert('User Unblocked', 'The user has been successfully unblocked.');
      fetchBlockedUsers(user.uid); // Refresh blocked users list
    } catch (error) {
      console.error("Error unblocking user: ", error);
      Alert.alert('Error', 'Failed to unblock user.');
    } finally {
      setUnblockingUserId(null); // Reset the unblocking user ID
    }
  };

  const renderBlockedUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Image
        source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }} // Default profile picture
        style={styles.profilePicture}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.firstName || 'No name available'}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {unblockingUserId === item.id ? ( // Show loading button while unblocking
        <ActivityIndicator size="small" color="#9966CC" />
      ) : (
        <Button title="Unblock" onPress={() => handleUnblockUser(item.id)} color="#9966CC" />
      )}
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    const user = firebase.auth().currentUser;
    if (user) {
      fetchBlockedUsers(user.uid);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View flex={1}>
    <Header/>
      <View style={styles.upperContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.productTypeContainer}>
          <Text style={styles.productTypeText}>BLOCKED USERS</Text>
        </View>
      </View>
      {loading ? ( // Show loading indicator for the list
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderBlockedUser}
          ListEmptyComponent={
            <View style={{ marginTop: 20 }}>
              <Text>No blocked users.</Text>
            </View>
          }
          onRefresh={onRefresh} // Set the refresh handler
          refreshing={refreshing} // Pass the refreshing state
        />
      )}
    </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9', // Light background color
  },
  userContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android
    marginBottom: 10, // Space between cards
    marginTop: 12,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    lineHeight: 20, // Adjust this value based on your button height to center vertically
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    lineHeight: 20, // Adjust this value based on your button height to center vertically
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
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default BlockedUsersList;
