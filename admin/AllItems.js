import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { db } from '../firebase/firebaseUserConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // To handle navigation
import backgroundImage from '../assets/background.png';

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsCollection = collection(db, 'products_services');
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsData = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData);
        setFilteredItems(itemsData); // Set the filtered items initially to all items
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search input and filter items
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Show all items when search is cleared
    }
  };

  const renderItem = ({ item }) => {
    const {
      name,
      price,
      sellerEmail,
      isFeatured,
      isRecommended,
      imageUrl,
      type, // Added type for display
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

          {/* Show the type (product or service) */}
          <Text style={styles.type}>Type: {type || 'No type available'}</Text>

          {isFeatured && <Text style={styles.featured}>Featured Item</Text>}
          {isRecommended && <Text style={styles.recommended}>Recommended</Text>}

          {/* Button to navigate to ProductDetail */}
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('AdminItem', { product: item })}
          >
            View Item
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>All Items</Text>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search for a product/service"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={filteredItems} // Use filteredItems for displaying the list
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No items found.</Text>}
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
  searchBar: {
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
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AllItems;
