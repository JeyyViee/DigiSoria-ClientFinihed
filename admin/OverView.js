import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebaseUserConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

const Overview = ({ navigation }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [clients, setClients] = useState(0);
  const [sellers, setSellers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hiddenItems, setHiddenItems] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [reportedUsers, setReportedUsers] = useState(0);
  const [reportedItems, setReportedItems] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);  // New state for requests
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data using real-time listeners
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
      const users = snapshot.docs.map((doc) => doc.data());
      setTotalUsers(users.length);
      setVerifiedUsers(users.filter((user) => user.verification_status === true).length);
      setClients(users.filter((user) => user.role === 'Client').length);
      setSellers(users.filter((user) => user.role === 'Seller').length);
      setBannedUsers(users.filter((user) => user.isBanned === true).length);
    });

    const unsubscribeReports = onSnapshot(query(collection(db, 'reports')), (snapshot) => {
      setReportedUsers(snapshot.size); // Real-time count of documents in the 'reports' collection
    });

    const unsubscribeItems = onSnapshot(query(collection(db, 'products_services')), (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data());
      setTotalItems(items.length);
      setHiddenItems(items.filter((item) => item.hidden === true).length);
      setReportedItems(items.filter((item) => item.isReported === true).length);
      setTotalProducts(items.filter((item) => item.type === 'product').length);
      setTotalServices(items.filter((item) => item.type === 'service').length);
    });

    const unsubscribeRequests = onSnapshot(query(collection(db, 'requests')), (snapshot) => {
      setTotalRequests(snapshot.size); // Real-time count of request documents
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeUsers();
      unsubscribeReports();
      unsubscribeItems();
      unsubscribeRequests(); // Cleanup request listener
    };
  }, []);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Refresh logic is handled by real-time listeners, so no additional fetch is needed
    setTimeout(() => setRefreshing(false), 1000); // Simulate network delay
  }, []);

  const userCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <MaterialCommunityIcons name="account-group" size={40} color="#6200ee" />,
      buttonTitle: 'All Users',
      onPress: () => navigation.navigate('UserList', { role: 'All' }),
    },
    {
      title: 'Verified Users',
      value: verifiedUsers,
      icon: <AntDesign name="checkcircle" size={40} color="green" />,
      buttonTitle: 'Verified Users',
      onPress: () => navigation.navigate('VerifiedUserList', { role: 'Verified' }),
    },
    {
      title: 'Clients',
      value: clients,
      icon: <FontAwesome5 name="user-friends" size={40} color="#f57c00" />,
      buttonTitle: 'Clients',
      onPress: () => navigation.navigate('ClientProfile', { role: 'Client' }),
    },
    {
      title: 'Sellers',
      value: sellers,
      icon: <MaterialCommunityIcons name="storefront" size={40} color="#1e88e5" />,
      buttonTitle: 'Sellers',
      onPress: () => navigation.navigate('SellerProfile', { role: 'Seller' }),
    },
    {
      title: 'Banned Users',
      value: bannedUsers,
      icon: <AntDesign name="closecircle" size={40} color="red" />,
      buttonTitle: 'Banned Users',
      onPress: () => navigation.navigate('BannedUsers'),
    },
    {
      title: 'Reported Users',
      value: reportedUsers,
      icon: <MaterialCommunityIcons name="account-alert" size={40} color="#ff9800" />,
      buttonTitle: 'Reports',
      onPress: () => navigation.navigate('ReportedUsers'),
    },
  ];

  const itemCards = [
    {
      title: 'All Items',
      value: totalItems,
      icon: <MaterialCommunityIcons name="package" size={40} color="#6200ee" />,
      buttonTitle: 'All Items',
      onPress: () => navigation.navigate('AllItems'),
    },
    {
      title: 'Products',
      value: totalProducts,
      icon: <MaterialCommunityIcons name="cart" size={40} color="#009688" />,
      buttonTitle: 'View Products',
      onPress: () => navigation.navigate('ProductScreen'),
    },
    {
      title: 'Services',
      value: totalServices,
      icon: <MaterialCommunityIcons name="toolbox" size={40} color="#ff5722" />,
      buttonTitle: 'View Services',
      onPress: () => navigation.navigate('ServicesScreen'),
    },
    {
      title: 'Hidden Items',
      value: hiddenItems,
      icon: <MaterialCommunityIcons name="eye-off" size={40} color="gray" />,
      buttonTitle: 'Hidden Items',
      onPress: () => navigation.navigate('HiddenItems'),
    },
    {
      title: 'Reported Items',
      value: reportedItems,
      icon: <MaterialCommunityIcons name="alert-circle" size={40} color="#ff5722" />,
      buttonTitle: 'Reported Items',
      onPress: () => navigation.navigate('ReportedItems'),
    },
    {
      title: 'Requests', // New Request card
      value: totalRequests,
      icon: <MaterialCommunityIcons name="comment-text" size={40} color="#4caf50" />, // Example icon for requests
      buttonTitle: 'View Requests',
      onPress: () => navigation.navigate('RequestsScreen'), // Navigate to the request management screen
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 18 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="#6200ee" onPress={() => navigation.goBack()} />
        <Text style={styles.heading}>Admin Dashboard</Text>
      </View>

      {/* User Management Section */}
      <Text style={styles.sectionTitle}>User Management</Text>
      <View style={styles.cardContainer}>
        {userCards.map((card, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {card.icon}
              <Title style={styles.cardTitle}>{card.title}</Title>
              <Paragraph style={styles.cardValue}>{card.value}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={card.onPress} style={styles.button}>
                {card.buttonTitle}
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>

      {/* Item Management Section */}
      <Text style={styles.sectionTitle}>Item Management</Text>
      <View style={styles.cardContainer}>
        {itemCards.map((card, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {card.icon}
              <Title style={styles.cardTitle}>{card.title}</Title>
              <Paragraph style={styles.cardValue}>{card.value}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={card.onPress} style={styles.button}>
                {card.buttonTitle}
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});

export default Overview;
