import React, { useState, useEffect } from 'react';
import { firebase } from '../firebase/firebaseUserConfig';
import ClientShopUI from '../client/ui/ShopView';

const ClientShop = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All'); // Default category
  const [refreshing, setRefreshing] = useState(false); // Refresh state
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true); // Loading state
  const [blockedUsers, setBlockedUsers] = useState([]); // Blocked users state

  // Function to fetch blocked users and products together
const fetchData = async () => {
  try {
    setLoading(true);
    const currentUser = firebase.auth().currentUser;

    // Fetch blocked users
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    const newBlockedUsers = userData?.blockedUsers || [];
    setBlockedUsers(newBlockedUsers);

    // Fetch products
    const querySnapshot = await firebase.firestore().collection('products_services').get();
    const fetchedProducts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Fetch seller's data to check blocking, banned status, and product visibility (hidden)
        const sellerDoc = await firebase.firestore().collection('users').doc(data.uid).get();
        const sellerData = sellerDoc.data();

        const sellerBlockedUsers = sellerData?.blockedUsers || [];
        const isSellerBanned = sellerData?.isBanned || false;
        const isHidden = data?.hidden || false;  // Check if the product is hidden

        // Check if the product's seller is blocked by the current user, banned, or if the product is hidden
        if (
          newBlockedUsers.includes(data.uid) || // Current user blocked the seller
          sellerBlockedUsers.includes(currentUser.uid) || // Seller blocked the current user
          isSellerBanned || // Seller is banned
          isHidden // Product is hidden
        ) {
          return null; // Exclude this product
        }

        return {
          id: doc.id,
          ...data,
        };
      })
    );

    // Remove null entries (products that were excluded)
    setProducts(fetchedProducts.filter((product) => product !== null));
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

  // Refresh handler for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Initial fetching of data
  useEffect(() => {
    fetchData();
  }, []); // Runs once on component mount

  // Filter products by category
  const filterByCategory = (products) => {
    switch (category) {
      case 'All':
        return [...products].sort((a, b) => b.popularity - a.popularity); // Use a copy to avoid mutating state
      case 'Product':
        return products.filter((product) => product.type === 'product');
      case 'Service':
        return products.filter((product) => product.type === 'service');
      default:
        return products;
    }
  };

  // Sort products based on selected criteria
  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price':
        return [...products].sort((a, b) => a.price - b.price); // Copy array before sorting
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return [...products].sort((a, b) => a.type.localeCompare(b.type));
      default:
        return products;
    }
  };

  // Apply filtering and sorting
  const displayedProducts = sortProducts(filterByCategory(products));

  return (
    <ClientShopUI
      navigation={navigation}
      products={displayedProducts}
      setCategory={setCategory}
      category={category}
      setSortBy={setSortBy}
      sortBy={sortBy}
      loading={loading} // Pass loading state to UI
      refreshing={refreshing} // Pass refreshing state to UI
      onRefresh={onRefresh} // Pass refresh handler to UI
    />
  );
};

export default ClientShop;
