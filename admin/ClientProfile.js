import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig'; // Ensure your Firebase config is correct
import { collection, getDocs, query, where } from 'firebase/firestore';
import backgroundImage from '../assets/background.png'; // Add your background image path
import placeholderImage from '../assets/users/userDefault.png'; // Import the placeholder image

const ClientProfile = ({ route, navigation }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(''); // Search state

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true); // Start loading
      const usersCollection = collection(db, 'users');
      const clientQuery = query(usersCollection, where('role', '==', 'Client'));
      const snapshot = await getDocs(clientQuery);
      const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(clientsData);
      setLoading(false); // Stop loading
    };

    fetchClients();
  }, []);

  // Filter clients based on search text
  const filteredClients = clients.filter(client =>
    client.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderClientDetails = ({ item }) => {
    const isVerified = item.verification_status;

    // Use placeholder image if no profile picture exists
    const profileImage = item.profilePic ? { uri: item.profilePic } : placeholderImage;

    return (
      <Card style={[styles.card, !isVerified && styles.cardNotVerified]}>
        <Card.Content>
          <View style={styles.profilePicContainer}>
            <Image source={profileImage} style={styles.profilePic} />
          </View>
          <Title style={styles.name}>{`${item.firstName} ${item.lastName}`}</Title>
          <Paragraph style={styles.bio}>{item.bio}</Paragraph>
          <Paragraph style={styles.email}>Email: {item.email}</Paragraph>
          <Paragraph style={styles.phoneNumber}>Phone: {item.phoneNumber}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => navigation.navigate('ProfileDashboard', { userId: item.uid })}
            disabled={!isVerified}
            style={[styles.button, !isVerified && styles.buttonDisabled]}
          >
            {isVerified ? 'View Profile' : 'Not Verified'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.heading}>Clients Details</Text>

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
          <FlatList
            data={filteredClients}
            renderItem={renderClientDetails}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flatListContainer}
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
    backgroundColor: '#E6E6FA', // Lavender background
  },
  cardNotVerified: {
    backgroundColor: '#f5f5f5', // Lighter background for unverified clients
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
  bio: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
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
  button: {
    backgroundColor: '#9966CC', // Amethyst color
    borderRadius: 20,
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
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default ClientProfile;
