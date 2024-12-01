import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { fetchAdminTransactions, notifyClient } from '../seller-src/FirestoreService';

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAdminTransactions();
      setTransactions(data);
    };
    fetchData();
  }, []);

  const handleNotifyClient = async (transactionId, files) => {
    await notifyClient(transactionId, files);
    alert('Client notified successfully!');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>Client: {item.clientName}</Text>
      <Text>Seller: {item.sellerName}</Text>
      <Text>Transaction ID: {item.id}</Text>
      <Button
        title="Notify Client"
        onPress={() => handleNotifyClient(item.id, item.files)}
      />
    </View>
  );

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
});

export default AdminDashboard;
