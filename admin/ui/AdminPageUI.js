import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, ImageBackground, RefreshControl, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, useTheme, Portal, Dialog, Paragraph, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import styles from '../styles/AdminPage.styles'
import backgroundImage from '../../assets/background.png';
import Header from '../../components/Header';
import { Animated, Easing } from 'react-native';

SplashScreen.preventAutoHideAsync();

const AdminPageUI = ({
  navigation,
  products,
  setCategory,
  sortBy,
  setSortBy,
  modalVisible,
  setModalVisible,
}) => {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [category, setLocalCategory] = useState(null);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setIsFetchingProducts(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  if (!fontsLoaded) {
    return null;
  }

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredProducts = products
    .filter((item) =>
      !category || item.type === category.toLowerCase() // Filter by category
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by product name
      (item.sellerName && item.sellerName.toLowerCase().includes(searchQuery.toLowerCase())) // Search by seller name
    )
    .filter((item) => item.hidden !== true); // Exclude hidden items

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.titleContainer, { backgroundColor: colors.primary }]}>
          <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold', color: colors.onPrimary }]}>
            Products/Services
          </Text>
        </View>

        {/* Search Bar */}
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchBar, { borderColor: colors.primary }]}
        />

        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          {['All', 'Product', 'Service'].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setLocalCategory(cat === 'All' ? null : cat)}
              style={[styles.categoryButton, category === cat && { backgroundColor: colors.primary, ...styles.activeCategoryButton }]}
            >
              <Text
                style={[
                  category === cat ? styles.activeCategoryText : styles.inactiveCategoryText,
                  {
                    fontFamily: 'Poppins_400Regular',
                    color: category === cat ? colors.onPrimary : colors.primary,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sort Picker */}
        <Picker
          selectedValue={sortBy}
          style={[styles.sortPicker, { color: colors.primary }]}
          onValueChange={(itemValue) => setSortBy(itemValue)}
        >
          <Picker.Item label="Sort by Date" value="date" />
          <Picker.Item label="Sort by Name" value="name" />
          <Picker.Item label="Sort by Price" value="price" />
        </Picker>

        {/* Loading Spinner */}
        {isFetchingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.productListContainer}>
            {/* Display products in rows */}
            {filteredProducts.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <View key={item.id} style={styles.rowContainer}>
                    {/* Display first card */}
                    <TouchableOpacity
                      style={[styles.productCard, { marginRight: 10, marginBottom: 10 }]}
                      onPress={() => navigation.navigate('AdminItem', { product: item })}
                    >
                      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.productImage} />}
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
                        onPress={() => navigation.navigate('AdminItem', { product: item })}
                        style={styles.buyButton}
                        labelStyle={{ fontFamily: 'Poppins_400Regular' }}
                      >
                        View Details
                      </Button>
                    </TouchableOpacity>

                    {/* Display second card if there's another one */}
                    {filteredProducts[index + 1] && (
                      <TouchableOpacity
                        style={[styles.productCard, { marginBottom: 10 }]}
                        onPress={() => navigation.navigate('AdminItem', { product: filteredProducts[index + 1] })}
                      >
                        {filteredProducts[index + 1].imageUrl && <Image source={{ uri: filteredProducts[index + 1].imageUrl }} style={styles.productImage} />}
                        <View style={styles.productInfo}>
                          <Text style={[styles.productName, { fontFamily: 'Poppins_600SemiBold', color: colors.primary }]}>
                            {filteredProducts[index + 1].name}
                          </Text>
                          <Text style={[styles.productPrice, { color: colors.secondary }]}>
                            ${filteredProducts[index + 1].price ? (filteredProducts[index + 1].price / 100).toFixed(2) : '0.00'}
                          </Text>
                          <Text style={[styles.productSeller, { color: colors.text }]}>
                            Seller: {filteredProducts[index + 1].sellerName}
                          </Text>
                        </View>
                        <Button
                          mode="contained"
                          color={colors.accent}
                          onPress={() => navigation.navigate('AdminItem', { product: filteredProducts[index + 1] })}
                          style={styles.buyButton}
                          labelStyle={{ fontFamily: 'Poppins_400Regular' }}
                        >
                          View Details
                        </Button>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }
            })}
          </View>
        )}
        {/* Modal for additional options */}
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            style={{ marginHorizontal: 20 }}
          >
            <Dialog.Title style={{ fontFamily: 'Poppins_600SemiBold' }}>Options</Dialog.Title>
            <Dialog.Content style={{ paddingBottom: 20 }}>
              <Paragraph style={{ fontFamily: 'Poppins_400Regular' }}>
                Choose one of the options below to proceed with the product/service management or view current transactions.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions
              style={{
                flexDirection: 'column',
                paddingBottom: 20,
                alignItems: 'stretch',
              }}
            >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate('TransactionList');
                setModalVisible(false);
              }}
              style={{ flex: 1, marginRight: 5 }}
              icon="pen"
            >
              Manage
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate('OverView');
                setModalVisible(false);
              }}
              style={{ flex: 1, marginLeft: 5 }}
              icon="eye"
            >
              View
            </Button>
          </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

     {/* Add New Button at the Bottom-Right */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Ionicons name="add-circle" size={60} color="#6c5ce7" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default AdminPageUI;
