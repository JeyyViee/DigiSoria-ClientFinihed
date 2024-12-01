import React, { useState, useEffect } from 'react';
import AdminPageUI from './ui/AdminPageUI';
import { firebase } from '../firebase/firebaseUserConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const AdminPage = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [bannedEmails, setBannedEmails] = useState([]); // Store banned user emails
  const [category, setCategory] = useState('Default');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch banned users' emails
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firebase.firestore(), 'users'), where('isBanned', '==', true)),
      (querySnapshot) => {
        const emails = querySnapshot.docs.map((doc) => doc.data().email);
        setBannedEmails(emails);
      },
      (error) => {
        console.error('Error fetching banned users: ', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch products/services data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebase.firestore(), 'products_services'),
      (querySnapshot) => {
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out products where sellerEmail is in bannedEmails
        const filteredProducts = fetchedProducts.filter(
          (product) => !bannedEmails.includes(product.sellerEmail)
        );

        setProducts(filteredProducts);
        setLoading(false); // Stop loading after filtering
      },
      (error) => {
        console.error('Error fetching products: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bannedEmails]); // Re-run whenever bannedEmails updates

  const filterByCategory = (products) => {
    switch (category) {
      case 'Popular':
        return products.sort((a, b) => b.popularity - a.popularity);
      case 'Product':
        return products.filter((product) => product.type === 'product');
      case 'Services':
        return products.filter((product) => product.type === 'service');
      default:
        return products;
    }
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price':
        return products.sort((a, b) => a.price - b.price);
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return products.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return products;
    }
  };

  const displayedProducts = sortProducts(filterByCategory(products));

  return (
    <PaperProvider theme={DefaultTheme}>
      <AdminPageUI
        navigation={navigation}
        products={displayedProducts}
        setCategory={setCategory}
        category={category}
        setSortBy={setSortBy}
        sortBy={sortBy}
        loading={loading}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </PaperProvider>
  );
};

export default AdminPage;
