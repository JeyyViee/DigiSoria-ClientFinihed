import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import SortBar from '../../components/SortBar';
import styles from '../styles/serviceProductCreation.styles';
import { useFonts } from 'expo-font';
import Header from '../../components/Header';

const ServiceProductCreationView = ({ userProducts, onDeleteProduct, navigation, pendingCounts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');

  const [fontsLoaded] = useFonts({
    'CHICKEN Pie': require('../../assets/fonts/font.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#4B0082" />;
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const filteredProducts = userProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'price') {
        return a.price - b.price;
      } else if (sortOption === 'creationDate') {
        return new Date(b.creationDate) - new Date(a.creationDate);
      } else {
        return a[sortOption].localeCompare(b[sortOption]);
      }
    });

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} // Update with your path
      style={styles.background} 
      resizeMode="cover"
    >
      <Header />
      <View style={styles.upperContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.productTypeContainer}>
          <Text style={styles.productTypeText}>MY CREATION</Text>
        </View>
      </View>

      <View style={styles.container}>
        <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
        <View style={styles.sortWrapper}>
          <SortBar sortOption={sortOption} onSortChange={handleSortChange} />
        </View>

        {filteredProducts.length === 0 ? (
          <Text style={styles.noProductsText}>No products/services found.</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                )}
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productCategory}>{item.category || 'Unknown'}</Text>
                  <Text style={styles.productPrice}>${(item.price / 100).toFixed(2)}</Text>
                  <Text style={styles.creationDate}>Added on: {item.creationDate}</Text>

                  {/* Show stock only for products */}
                  {item.type === 'product' && item.stock && (
                    <Text style={styles.stockText}>Stock: {item.stock}</Text>
                  )}

                 <View style={styles.buttonContainer}>
                    {/* Eye Icon */}
<TouchableOpacity
  style={styles.eyeButton}
  onPress={() => {
    navigation.navigate('PendingCreation', { 
      productId: item.productId, 
      serviceId: item.serviceId || null, 
    });
  }}
>
  <Ionicons name="eye" size={24} color="#4B0082" />
  {pendingCounts[item.productId || item.serviceId] > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{pendingCounts[item.productId || item.serviceId]}</Text>
    </View>
  )}
</TouchableOpacity>


                    {/* Delete Button */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDeleteProduct(item.id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
};

export default ServiceProductCreationView;
