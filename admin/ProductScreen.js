import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig';
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/background.png';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const itemsCollection = collection(db, 'products_services');
        const productsQuery = query(itemsCollection, where('type', '==', 'product'));
        const itemsSnapshot = await getDocs(productsQuery);
        const productsData = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }) => {
    const { name, price, sellerEmail, imageUrl } = item;

    return (
      <Card style={styles.card}>
        <Card.Content>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          )}
          <Text style={styles.itemTitle}>{name || 'Unnamed Product'}</Text>
          <Text style={styles.sellerEmail}>Seller Email: {sellerEmail || 'No email available'}</Text>
          <Text style={styles.price}>Price: ${price}</Text>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('AdminItem', { product: item })}
          >
            View Product
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Products</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No products found.</Text>}
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

export default ProductsScreen;
