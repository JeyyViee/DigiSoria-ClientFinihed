import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, ImageBackground, ActivityIndicator, Image, Alert } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig'; // Ensure your Firebase config is correct
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import backgroundImage from '../assets/background.png'; // Add your background image path
import placeholderImage from '../assets/users/userDefault.png'; // Import the placeholder image
import { FAB } from 'react-native-paper';

const BannedUsers = ({ navigation }) => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(''); // Search state

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    setLoading(true); // Start loading
    const usersCollection = collection(db, 'users');
    const bannedUsersQuery = query(usersCollection, where('isBanned', '==', true));
    const snapshot = await getDocs(bannedUsersQuery);
    const bannedUsersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBannedUsers(bannedUsersData);
    setLoading(false); // Stop loading
  };

  // Function to unban a user
  const unbanUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { isBanned: false });
      Alert.alert('Success', 'User has been unbanned.');
      fetchBannedUsers(); // Refresh the banned users list
    } catch (error) {
      Alert.alert('Error', 'Failed to unban the user.');
    }
  };

  // Filter banned users based on search text
  const filteredBannedUsers = bannedUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBannedUserDetails = ({ item }) => {
    // Use placeholder image if no profile picture exists
    const profileImage = item.profilePic ? { uri: item.profilePic } : placeholderImage;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profilePicContainer}>
            <Image source={profileImage} style={styles.profilePic} />
          </View>
          <Title style={styles.name}>{`${item.firstName} ${item.lastName}`}</Title>
          <Paragraph style={styles.email}>Email: {item.email}</Paragraph>
          <Paragraph style={styles.phoneNumber}>Phone: {item.phoneNumber}</Paragraph>
          <Paragraph style={styles.reason}>
            Reason for Ban: {item.banReason || 'Not specified'}
          </Paragraph>
          {/* Display reportCount */}
          <Paragraph style={styles.reportCount}>
            Report Count: {item.reportCount || '0'}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            onPress={() => navigation.navigate('ProfileDashboard', { userId: item.uid })}
            style={styles.viewProfileButton}
          >
            View Profile
          </Button>
          <Button
            onPress={() =>
              Alert.alert(
                'Unban User',
                'Are you sure you want to unban this user?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Unban', onPress: () => unbanUser(item.id) },
                ]
              )
            }
            style={styles.unbanButton}
          >
            Unban
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.heading}>Banned Users</Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name or email"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#9966CC" style={styles.loadingIndicator} />
        ) : (
          <>
            {filteredBannedUsers.length === 0 ? (
              <Text style={styles.noUsersText}>No banned users available</Text> // Show this message if no users are found
            ) : (
              <FlatList
                data={filteredBannedUsers}
                renderItem={renderBannedUserDetails}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.flatListContainer}
              />
            )}
          </>
        )}

        {/* Floating Button for Navigation */}
        <FAB
          style={styles.fab}
          icon="account-alert"
          label="Eligible for Banning"
          onPress={() => navigation.navigate('EligibleBanning')}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Text color for contrast with background
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#FFE6E6', // Light red background for banned users
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  reason: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  reportCount: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  noUsersText: {
    fontSize: 16,
    color: '#ff6666',
    textAlign: 'center',
    marginTop: 20,
  },
  cardActions: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  viewProfileButton: {
    backgroundColor: '#9966CC', // Amethyst color
    borderRadius: 20,
  },
  unbanButton: {
    backgroundColor: '#32CD32', // Green color for unban button
    borderRadius: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFA500', // Orange color
  },
});

export default BannedUsers;
