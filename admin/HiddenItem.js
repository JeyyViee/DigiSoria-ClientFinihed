import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig';
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/background.png';

const HiddenItems = () => {
  const [hiddenItems, setHiddenItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unhideLoading, setUnhideLoading] = useState({}); // Track loading status for each item
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHiddenItems = async () => {
      try {
        const itemsCollection = collection(db, 'products_services');
        const hiddenQuery = query(itemsCollection, where('hidden', '==', true));
        const itemsSnapshot = await getDocs(hiddenQuery);
        const itemsData = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHiddenItems(itemsData);
      } catch (error) {
        console.error('Error fetching hidden items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenItems();
  }, []);

  const unhideItem = async (item) => {
    setUnhideLoading((prev) => ({ ...prev, [item.id]: true })); // Set loading for the current item
    try {
      const itemDocRef = doc(db, 'products_services', item.id);
      await updateDoc(itemDocRef, { hidden: false });

      // Send notification to the `sentToSellers` collection
      const notification = {
        productId: item.id,
        sellerEmail: item.sellerEmail,
        message: `Your product "${item.name}" is now visible to users.`,
        timestamp: new Date().toISOString(),
        productDetails: {
          name: item.name,
          price: item.price,
          type: item.type,
          imageUrl: item.imageUrl,
        },
      };
      await addDoc(collection(db, 'sentToSellers'), notification);

      Alert.alert('Success', `Item "${item.name}" is now unhidden.`);
      setHiddenItems(hiddenItems.filter(hiddenItem => hiddenItem.id !== item.id));
    } catch (error) {
      console.error('Error unhiding item:', error);
      Alert.alert('Error', 'Failed to unhide the item. Please try again.');
    } finally {
      setUnhideLoading((prev) => ({ ...prev, [item.id]: false })); // Clear loading for the current item
    }
  };

  const renderItem = ({ item }) => {
    const {
      name,
      price,
      sellerEmail,
      imageUrl,
      isFeatured,
      isRecommended,
      type,
    } = item;

    return (
      <Card style={styles.card}>
        <Card.Content>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          )}
          <Text style={styles.itemTitle}>{name || 'Unnamed Item'}</Text>
          <Text style={styles.sellerEmail}>Seller Email: {sellerEmail || 'No email available'}</Text>
          <Text style={styles.price}>Price: ${price}</Text>
          <Text style={styles.type}>Type: {type || 'No type available'}</Text>
          {isFeatured && <Text style={styles.featured}>Featured Item</Text>}
          {isRecommended && <Text style={styles.recommended}>Recommended</Text>}

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('AdminItem', { product: item })}
          >
            View Item
          </Button>

          {/* Button to unhide the item */}
          {unhideLoading[item.id] ? (
            <ActivityIndicator size="small" color="green" style={styles.loadingIndicator} />
          ) : (
            <Button
              mode="contained"
              color="green"
              style={styles.unhideButton}
              onPress={() => unhideItem(item)}
            >
              Unhide Item
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Hidden Items</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={hiddenItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No hidden items found.</Text>}
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
  type: {
    fontSize: 14,
    color: '#6200ee',
    marginBottom: 5,
  },
  featured: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  recommended: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  button: {
    marginTop: 10,
  },
  unhideButton: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HiddenItems;
