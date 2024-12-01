import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import backgroundImage from '../assets/background.png'; // Add background image path
import placeholderImage from '../assets/users/userDefault.png'; // Add placeholder image path

const EligibleBanning = ({ navigation }) => {
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEligibleUsers();
  }, []);

    const fetchEligibleUsers = async () => {
    try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const eligibleUsersQuery = query(
        usersCollection,
        where('reportCount', '>=', 50),
        where('isBanned', '==', false)
        );
        const snapshot = await getDocs(eligibleUsersQuery);
        const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEligibleUsers(usersData);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        if (error.code === "failed-precondition") {
        alert("The query requires an index. Check your Firebase console to create it.");
        }
    } finally {
        setLoading(false);
    }
    };

  const renderUserDetails = ({ item }) => {
    const profileImage = item.profilePic ? { uri: item.profilePic } : placeholderImage;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profilePicContainer}>
            <Image source={profileImage} style={styles.profilePic} />
          </View>
          <Title style={styles.name}>{`${item.firstName} ${item.lastName}`}</Title>
          <Paragraph style={styles.email}>Email: {item.email}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            style={styles.viewProfileButton}
            onPress={() => navigation.navigate('ProfileDashboard', { userId: item.id })}
          >
            View Profile
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.heading}>Eligible for Banning</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#9966CC" style={styles.loadingIndicator} />
        ) : eligibleUsers.length > 0 ? (
          <FlatList
            data={eligibleUsers}
            renderItem={renderUserDetails}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users are eligible for banning at the moment.</Text>
          </View>
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
    color: '#fff',
  },
  card: {
    marginBottom: 20,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#E6F7FF', // Light blue background for eligible users
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  cardActions: {
    marginTop: 10,
    justifyContent: 'center',
  },
  viewProfileButton: {
    backgroundColor: '#9966CC', // Amethyst color for button
    borderRadius: 20,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});

export default EligibleBanning;
