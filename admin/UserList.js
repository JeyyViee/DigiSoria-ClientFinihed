import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig'; // Ensure your Firebase config is correct
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import backgroundImage from '../assets/background.png';

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for fetching users
  const [adminLoading, setAdminLoading] = useState(null); // Track user being updated

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true when fetching starts
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        originalRole: doc.data().role,
      })); // Store original role
      setUsers(usersData);
      setLoading(false); // Set loading to false after the data is fetched
    };

    fetchUsers();
  }, []);

  // Filter users by email
  const filteredUsers = users.filter(user =>
    user.email && user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Toggle user's role in Firestore
  const handleToggleSwitch = async user => {
    try {
      setAdminLoading(user.id); // Show loading indicator for the user being updated
      const userRef = doc(db, 'users', user.id); // Reference to the user document
      const newRole = user.role === 'Admin' ? user.originalRole : 'Admin'; // Toggle role between 'Admin' and original role
      await updateDoc(userRef, { role: newRole }); // Update the role in Firestore
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === user.id ? { ...u, role: newRole } : u))
      ); // Update state to reflect the change
    } catch (error) {
      console.error('Error updating user role: ', error);
    } finally {
      setAdminLoading(null); // Reset loading state
    }
  };

  const renderItem = ({ item }) => {
    const isVerified = item.verification_status;
    const isAdmin = item.role === 'Admin';

    return (
      <Card style={[styles.card, !isVerified && styles.cardNotVerified]}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>
            <Text style={styles.boldText}>Role: </Text>{item.role}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Verification Status: </Text>
            {isVerified ? 'Verified' : 'Not Verified'}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Email: </Text>{item.email}
          </Paragraph>

          {/* Switch to toggle Admin role */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {isAdmin ? 'Admin' : 'Make Admin'}
            </Text>
            {adminLoading === item.id ? (
              <ActivityIndicator size="small" color="#9966CC" />
            ) : (
              <Switch
                value={isAdmin}
                onValueChange={() => handleToggleSwitch(item)}
                disabled={adminLoading !== null} // Disable switches while any update is in progress
              />
            )}
          </View>
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() => navigation.navigate('ProfileDashboard', { userId: item.uid })}
            disabled={!isVerified || adminLoading === item.id} // Disable button while updating
            style={[styles.button, (!isVerified || adminLoading === item.id) && styles.buttonDisabled]} // Apply custom button style
            labelStyle={styles.buttonText} // Apply white text color
          >
            {isVerified ? 'View Details' : 'Not Verified'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.backgroundImage, { flex: 1 }]}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>All Users</Text>

        {/* Search bar for filtering users by email */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by email"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Show loading spinner if the data is still loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#9966CC" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: '#E6E6FA', // Lavender background for the card
  },
  cardNotVerified: {
    marginBottom: 30, // Add extra bottom margin for unverified users
  },
  boldText: {
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#E6E6FA',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9966CC', // Amethyst color
    borderRadius: 20,
  },
  buttonText: {
    color: 'white', // White text color for the button
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3', // Light grey background for disabled button
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UsersList;
