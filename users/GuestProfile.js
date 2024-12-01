import React, { useEffect, useState } from 'react';
import { firebase } from '../firebase/firebaseUserConfig';
import ProfileGuestView from './ui/GuestProfileUI';

const ProfileGuest = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredFeaturedProducts, setFilteredFeaturedProducts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [userRole, setUserRole] = useState('');

  const fetchBlockedUsers = async (userId) => {
    try {
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.blockedUsers) {
        setBlockedUsers(userData.blockedUsers);
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      setUserRole(userData.role || 'guest'); // Default to 'guest' if role is not defined
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchUsersWithCollections = async () => {
    setLoadingUsers(true);
    try {
      const currentUser = firebase.auth().currentUser;
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      const blockedUsers = userDoc.data().blockedUsers || [];

      const usersSnapshot = await firebase.firestore().collection('users').get();
      const usersData = await Promise.all(
        usersSnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          if (!userData.verification_status || blockedUsers.includes(userData.uid)) return null;

          // Check if the current user is blocked by this user
          const blockedByCurrentUser = userData.blockedUsers?.includes(currentUser.uid) || false;
          if (blockedByCurrentUser) return null;

          let profilePicUrl = userData.profilePic || null;
          if (!profilePicUrl) {
            profilePicUrl = await firebase.storage()
              .ref(`profilePics/${userData.uid}.jpg`)
              .getDownloadURL()
              .catch(() => null);
          }

          const collectionSnapshot = await doc.ref.collection('userCollection').get();
          const userCollectionData = collectionSnapshot.docs.map(subDoc => subDoc.data());
          const combinedData = { ...userData, ...userCollectionData[0], profilePicUrl };
          return combinedData;
        })
      );

      setUsers(usersData.filter(user => user !== null));
    } catch (error) {
      console.error("Error fetching users with collections:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

const fetchProducts = async () => {
  setLoadingFeatured(true);
  setLoadingProducts(true);
  try {
    const currentUser = firebase.auth().currentUser;
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    const blockedUsers = userDoc.data()?.blockedUsers || [];

    const productsSnapshot = await firebase.firestore().collection('products_services').get();
    const productsData = await Promise.all(
      productsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Skip hidden products
        if (data.hidden) return null;

        const createdDate = data.createdAt
          ? new Date(data.createdAt).toLocaleDateString()
          : data.createdAtFormatted
          ? new Date(data.createdAtFormatted).toLocaleDateString()
          : data.createdAtReadable || "Date not available";

        // Fetch seller's data
        const sellerDoc = await firebase.firestore().collection('users').doc(data.uid).get();
        if (!sellerDoc.exists) {
          console.warn(`Seller with UID ${data.uid} does not exist.`);
          return null; // Skip product if the seller does not exist
        }

        const sellerData = sellerDoc.data();

        // Check if the product's seller is banned
        if (sellerData?.isBanned) {
          return null; // Exclude products from banned users
        }

        // Check if the product's seller has blocked the current user or vice versa
        const sellerBlockedUsers = sellerData?.blockedUsers || [];
        if (
          blockedUsers.includes(data.uid) ||       // Current user has blocked this product's seller
          sellerBlockedUsers.includes(currentUser.uid) // Product's seller has blocked the current user
        ) {
          return null; // Filter out this product
        }

        return { id: doc.id, ...data, createdDate };
      })
    );

    const visibleProducts = productsData.filter(product => product !== null);
    setProducts(visibleProducts);
    setFeaturedProducts(visibleProducts.filter(product => product.isFeatured));
  } catch (error) {
    console.error("Error fetching products/services:", error);
  } finally {
    setLoadingFeatured(false);
    setLoadingProducts(false);
  }
};

useEffect(() => {
    const userId = firebase.auth().currentUser.uid; 
    fetchBlockedUsers(userId); // Fetch blocked users
    fetchUsersWithCollections();
    fetchProducts();
    fetchUserRole();
  }, []);

    useEffect(() => {
      // Filter out blocked users from the list
      const filtered = users.filter(user => !blockedUsers.includes(user.uid));
      setFilteredUsers(filtered.filter(user =>
        (user.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      ));
    }, [searchQuery, users, blockedUsers]);

  useEffect(() => {
    // Filter products based on search query and blocked users, excluding hidden products
    const filteredProducts = products.filter(product => 
      !product.hidden && // Exclude hidden products
      ((product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (product.sellerName?.toLowerCase() || '').includes(searchQuery.toLowerCase())) &&
      !blockedUsers.includes(product.uid) // Ensure the seller is not blocked
    );
    setFilteredProducts(filteredProducts);
    setFilteredFeaturedProducts(filteredProducts.filter(product => product.isFeatured));
  }, [searchQuery, products, blockedUsers]);

  return (
    <ProfileGuestView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredUsers={filteredUsers}
      filteredProducts={filteredProducts}
      filteredFeaturedProducts={filteredFeaturedProducts}
      loadingUsers={loadingUsers}
      loadingFeatured={loadingFeatured}
      loadingProducts={loadingProducts}
      fetchProducts={fetchProducts}
      fetchUserCollection={fetchUsersWithCollections}
      fetchUserRole={fetchUserRole}
    />
  );
};

export default ProfileGuest;
