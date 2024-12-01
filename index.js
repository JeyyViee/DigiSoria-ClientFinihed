import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { firebase } from "./firebase/firebaseUserConfig";
import { createStackNavigator } from "@react-navigation/stack";

// Importing Auth Screens
import Login from "./users/Login";
import HomeRegistrationScreen from "./users/HomeRegistrationScreen";
import ClientRegistrationScreen from "./users/ClientRegistrationScreen";
import SellerRegistrationScreen from "./users/SellerRegistrationScreen";
import LoadingScreen from './users/LoadingScreen';

// Import Client and Seller Navigation
import { ClientTabs } from './navigation/ClientNavigation';
import { SellerTabs } from './navigation/SellerNavigation';
import { AdminTabs } from './navigation/AdminNavigation';

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const onAuthStateChanged = useCallback(async (user) => {
    setUser(user);

    if (user) {
      // Check if the email is verified
      if (!user.emailVerified) {

        await firebase.auth().signOut();
        setUser(null);
        setUserRole(null);
        return; // Prevent further processing
      }

      // Attempt to fetch role only if the email is verified
      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const role = userDoc.data().role;
          setUserRole(role);
        } else {
          // If the document doesn't exist, reset the user role
          setUserRole(null);
          console.warn('User document does not exist in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching user role: ', error);
      }
    } else {
      // If no user is authenticated, reset the user role
      setUserRole(null);
    }

    if (initializing) setInitializing(false);
  }, [initializing]);

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, [onAuthStateChanged]);

  if (initializing) return <LoadingScreen />;

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeRegistrationScreen" component={HomeRegistrationScreen} />
        <Stack.Screen name="ClientRegistrationScreen" component={ClientRegistrationScreen} />
        <Stack.Screen name="SellerRegistrationScreen" component={SellerRegistrationScreen} />
      </Stack.Navigator>
    );
  }

  if (initializing || userRole === null) {
  return <LoadingScreen />;
  }

    return userRole === 'Admin' ? (
    <AdminTabs setUser={setUser} />
  ) : userRole === 'Seller' ? (
    <SellerTabs setUser={setUser} setUserRole={setUserRole} />
  ) : (
    <ClientTabs setUser={setUser} setUserRole={setUserRole} />
  );
}

export default () => (
  <NavigationContainer independent={true}>
    <App />
  </NavigationContainer>
);
