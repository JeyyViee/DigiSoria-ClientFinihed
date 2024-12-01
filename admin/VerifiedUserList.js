import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig'; // Ensure your Firebase config is correct
import { collection, getDocs, query, where } from 'firebase/firestore';
import backgroundImage from '../assets/background.png'; // Update with correct path

const VerifiedUsersList = ({ navigation }) => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch verified users from Firestore
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      setLoading(true); // Set loading to true when fetching starts
      const usersCollection = collection(db, 'users');
      const verifiedUsersQuery = query(usersCollection, where("verification_status", "==", true));
      const snapshot = await getDocs(verifiedUsersQuery);
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVerifiedUsers(usersData);
      setLoading(false); // Set loading to false after the data is fetched
    };

    fetchVerifiedUsers();
  }, []);

  // Filter users by email
  const filteredUsers = verifiedUsers.filter(user =>
    user.email && user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const isVerified = item.verification_status;

    return (
      <Card style={[styles.card, !isVerified && styles.cardNotVerified]}>
        <Card.Content>
          {/* Profile picture */}
          {item.profilePic && (
            <Image
              source={{ uri: item.profilePic }}
              style={styles.profilePic}
            />
          )}

          <Title>{item.firstName} {item.lastName}</Title>
          <Paragraph>
            <Text style={styles.boldText}>Role: </Text>{item.role}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Email: </Text>{item.email}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Phone/Gcash: </Text>{item.phoneNumber}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Bio: </Text>{item.bio}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Completed Transactions: </Text>{item.completedTransactions}
          </Paragraph>

          {/* For Sellers */}
          {item.role === 'Seller' && (
            <>
              <Paragraph>
                <Text style={styles.boldText}>Products: </Text>{item.products ? item.products.length : 0}
              </Paragraph>
              <Paragraph>
                <Text style={styles.boldText}>Services: </Text>{item.services ? item.services.length : 0}
              </Paragraph>
            </>
          )}

          {/* For Clients */}
          {item.role === 'Client' && (
            <>
              <Paragraph>
                <Text style={styles.boldText}>Followers: </Text>{item.followers ? item.followers.length : 0}
              </Paragraph>
              <Paragraph>
                <Text style={styles.boldText}>Reports: </Text>{item.reportCount}
              </Paragraph>
            </>
          )}
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() => navigation.navigate('ProfileDashboard', { userId: item.uid })}
            disabled={!isVerified} // Disable button if not verified
            style={[styles.button, !isVerified && styles.buttonDisabled]} // Apply custom button style
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
      <View style={styles.container}>
        <Text style={styles.heading}>Verified Users</Text>

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
          />
        )}
      </View>
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default VerifiedUsersList;
