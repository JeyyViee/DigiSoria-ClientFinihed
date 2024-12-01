import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../../assets/background.png';
import styles from '../styles/GuesProfile.styles';
import Header from '../../components/Header';

const ProfileGuestView = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredUsers, 
  filteredProducts, 
  filteredFeaturedProducts, 
  loadingUsers,
  loadingFeatured,
  loadingProducts,
  fetchProducts, // Pass fetchProducts as a prop to call when refreshing
  fetchUserCollection,
  fetchUserRole
}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts(); // Call fetchProducts to refresh the data
    setRefreshing(false);
    await fetchUserCollection(); // Call fetchProducts to refresh the data
    setRefreshing(false);
  }, [fetchProducts, fetchUserCollection]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Trigger onRefresh when swiped down
            colors={['#6200EE']} // You can change the color as needed
          />
        }
      >
        {/* Search Bar with Icon */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search for products, sellers, or services..."
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        {/* Featured Products Section */}
        <Text style={styles.subtitle}>Featured Products</Text>
        {loadingFeatured ? (
          <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {filteredFeaturedProducts.slice(0, 2).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cardAbove}
                onPress={() => {
                  const routes = navigation.getState().routeNames; // Get available routes
                  if (routes.includes('AdminItem')) {
                    navigation.navigate('AdminItem', { product: item });
                  } else if (routes.includes('ProductDetail')) {
                    navigation.navigate('ProductDetail', { product: item });
                  }  else if (routes.includes('ShoppingBuy')) {
                    navigation.navigate('ShoppingBuy', { product: item });
                  }
                   else {
                    console.warn('No matching route found for ProductDetail or AdminItemView.');
                  }
                }}
              >
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.featuredProductText} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  <Text style={styles.featuredProductPrice}>
                    ${item.price / 100}
                  </Text>
                  <Text style={styles.featuredProductSeller} numberOfLines={1} ellipsizeMode="tail">
                    {item.sellerName}
                  </Text>
                  <Text style={styles.featuredProductDate}>
                    Date: {item.createdDate}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
      {/* Registered User Section */}
      <Text style={styles.title}>Registered Users</Text>
      {loadingUsers ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalFlatList}
        >
          {filteredUsers
            .filter(user => user.role !== 'Admin' && !user.isBanned)
            .map((item) => (
              <TouchableOpacity
                key={item.uid || item.id}
                style={styles.card}
                onPress={() => navigation.navigate('ProfileDashboard', { userId: item.uid })}
              >
                <Image
                  source={item.profilePicUrl ? { uri: item.profilePicUrl } : require('../../assets/users/userDefault.png')}
                  style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.userRole}>{item.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

        {/* Products and Services Section */}
        <Text style={styles.subtitle}>Products and Services</Text>
        {loadingProducts ? ( // Show loading indicator if products are loading
          <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.productsContainerBelow}>
            {filteredProducts
            .map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.productCardBelow}
                onPress={() => {
                  const routes = navigation.getState().routeNames; // Get available routes
                  if (routes.includes('AdminItem')) {
                    navigation.navigate('AdminItem', { product: item });
                  } else if (routes.includes('ProductDetail')) {
                    navigation.navigate('ProductDetail', { product: item });
                  }  else if (routes.includes('ShoppingBuy')) {
                    navigation.navigate('ShoppingBuy', { product: item });
                  }
                   else {
                    console.warn('No matching route found for ProductDetail or AdminItemView.');
                  }
                }}
            >
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productText} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                  <Text style={styles.priceText}>${item.price / 100}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileGuestView;
