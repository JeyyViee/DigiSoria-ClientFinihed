import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/background.png';

const ServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const itemsCollection = collection(db, 'products_services');
        const servicesQuery = query(itemsCollection, where('type', '==', 'service'));
        const itemsSnapshot = await getDocs(servicesQuery);
        const servicesData = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderItem = ({ item }) => {
    const { name, price, sellerEmail, imageUrl } = item;

    return (
      <Card style={styles.card}>
        <Card.Content>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          )}
          <Text style={styles.itemTitle}>{name || 'Unnamed Service'}</Text>
          <Text style={styles.sellerEmail}>Seller Email: {sellerEmail || 'No email available'}</Text>
          <Text style={styles.price}>Price: ${price}</Text>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('AdminItem', { product: item })}
          >
            View Service
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Services</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No services found.</Text>}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sellerEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ServicesScreen;
