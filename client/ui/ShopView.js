import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'; // Ensure TextInput is imported
import { Picker } from '@react-native-picker/picker';
import { Button, useTheme } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import styles from '../styles/shop.styles';
import backgroundImage from '../../assets/background.png';
import Header from '../../components/Header';

SplashScreen.preventAutoHideAsync();

const ClientShopUI = ({ navigation, products, setCategory, category, setSortBy, sortBy, onRefresh, refreshing, loading }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Filter recommended products separately, regardless of category
  const recommendedProducts = products.filter((product) => product.isRecommended);

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) =>
    (category === 'All' || product.type === category.toLowerCase()) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.backgroundImage, { flex: 1 }]}
      resizeMode="cover"
    >
      <Header />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={ // Add RefreshControl here
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={[styles.titleContainer, { backgroundColor: colors.primary }]}>
          <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold', color: colors.onPrimary }]}>
            Products/Services
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <TextInput
                style={[styles.searchBar, { borderColor: colors.primary, color: colors.text }]}
                placeholder="Search products..."
                placeholderTextColor={colors.primary}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>

            {/* Category Buttons */}
            <View style={styles.categoryContainer}>
              {['All', 'Product', 'Service'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryButton,
                    category === cat && { backgroundColor: colors.primary, ...styles.activeCategoryButton },
                  ]}
                >
                  <Text
                    style={[
                      category === cat ? styles.activeCategoryText : styles.inactiveCategoryText,
                      { fontFamily: 'Poppins_400Regular', color: category === cat ? colors.onPrimary : colors.primary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recommended Section */}
            {recommendedProducts.length > 0 && (
              <View style={styles.recommendedSectionContainer}>
                <Text style={styles.subtitle}>Recommended for You</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalFlatList}
                >
                  {recommendedProducts.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.recommendedCardHorizontal}
                      onPress={() => navigation.navigate('ShoppingBuy', { product: item })}
                    >
                      {item.imageUrl && (
                        <Image source={{ uri: item.imageUrl }} style={styles.recommendedImageHorizontal} />
                      )}
                      <View style={styles.recommendedInfoHorizontal}>
                        <Text style={styles.recommendedProductText} numberOfLines={1} ellipsizeMode="tail">
                          {item.name}
                        </Text>
                        <Text style={styles.recommendedProductPrice}>${(item.price / 100).toFixed(2)}</Text>
                        <Text style={styles.recommendedProductSeller} numberOfLines={1} ellipsizeMode="tail">
                          Seller: {item.sellerName}
                        </Text>
                        <Text style={styles.recommendedProductDate}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Sort Picker */}
            <Picker
              selectedValue={sortBy}
              style={[styles.sortPicker, { color: colors.primary }]}
              onValueChange={(itemValue) => setSortBy(itemValue)}
            >
              <Picker.Item label="Sort by Date" value="date" />
              <Picker.Item label="Sort by Name" value="name" />
              <Picker.Item label="Sort by Type" value="type" />
              <Picker.Item label="Sort by Price" value="price" />
            </Picker>

            {/* Product List or Empty Message */}
            {filteredProducts.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={{ color: colors.primary, textAlign: 'center', marginTop: 20 }}>
                  No products/services available. Pull down to refresh.
                </Text>
              </View>
            ) : (
              <View style={styles.productListContainer}>
                {filteredProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productCard}
                    onPress={() => navigation.navigate('ShoppingBuy', { product: item })}
                  >
                    {item.imageUrl && (
                      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { fontFamily: 'Poppins_600SemiBold', color: colors.primary }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.productPrice, { color: colors.secondary }]}>
                        ${item.price ? (item.price / 100).toFixed(2) : '0.00'}
                      </Text>
                      <Text style={[styles.productSeller, { color: colors.text }]}>
                        Seller: {item.sellerName}
                      </Text>
                    </View>
                    <Button
                      mode="contained"
                      color={colors.accent}
                      onPress={() => navigation.navigate('ShoppingBuy', { product: item })}
                      style={styles.buyButton}
                      labelStyle={{ fontFamily: 'Poppins_400Regular' }}
                    >
                      Buy Now
                    </Button>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default ClientShopUI;
