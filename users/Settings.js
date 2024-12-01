import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { firebase } from '../firebase/firebaseUserConfig';
import SettingsUI from './ui/SettingsUI'; // Ensure this import is correct
import styles from './styles/Settings.styles';

const Settings = ({ setUser, setUserRole }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        setErrorMessage('User is not authenticated');
        setLoading(false);
        return;
      }
      
      setEmail(currentUser.email);

      // Fetch user details
      try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setProfilePic(userData.profilePic || null);
          setRole(userData.role || 'User');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

const handleSignOut = async () => {
  try {
    await firebase.auth().signOut();
    setUser(null);
    if (setUserRole) {
      setUserRole(null);  // Only call if setUserRole is passed
    }
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};


  const handleResetPassword = async () => {
    if (email.trim() === '') {
      Alert.alert('Invalid input', 'Please enter your email address.');
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent successfully!');
    } catch (error) {
      setErrorMessage('Error sending password reset email: ' + error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#8A2BE2" style={styles.loader} />;
  }

  return (
      <SettingsUI
        email={email}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        handleResetPassword={handleResetPassword}
        handleSignOut={handleSignOut}
        firstName={firstName}
        lastName={lastName}
        profilePic={profilePic}
        role={role}
        loading={loading}
        errorMessage={errorMessage}
      />
  );
};

export default Settings;
