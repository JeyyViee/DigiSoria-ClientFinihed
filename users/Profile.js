import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { firebase } from '../firebase/firebaseUserConfig';
import useEmailVerificationStatus from '../src/useEmailVerificationStatus';
import DashboardUI from './ui/ProfleUI';

const Dashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEmailVerificationStatus();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        setErrorMessage('User is not authenticated');
        setLoading(false);
        return;
      }

      setEmail(currentUser.email);

      if (!currentUser.emailVerified) {
        setErrorMessage('Your email is not verified. A verification email has been sent. Please verify your email.');
        try {
          await currentUser.sendEmailVerification();
        } catch (error) {
          setErrorMessage('Error sending verification email: ' + error.message);
        }
        await firebase.auth().signOut();
        setLoading(false);
        return;
      }

      try {
        const snapshot = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (snapshot.exists) {
          const userData = snapshot.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setBio(userData.bio || '');
          setProfilePic(userData.profilePic || null);
        } else {
          await createUserDocument(currentUser.uid);
        }
      } catch (error) {
        setErrorMessage('Error fetching user data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const createUserDocument = async (uid) => {
    try {
      await firebase.firestore().collection('users').doc(uid).set({
        firstName: '',
        lastName: '',
        bio: '', // Initialize bio
        profilePic: null,
      });
    } catch (error) {
      setErrorMessage('Error creating user document: ' + error.message);
    }
  };

  // Function to validate and trim the first name
  const handleFirstNameChange = (text) => {
    const trimmedText = text
      .replace(/[^a-zA-Z\s.]/g, '') 
      .replace(/\s{2,}/g, ' ')
      .replace(/\.{2,}/g, '.')
      .slice(0, 15);

    setFirstName(trimmedText);
  };

  // Function to validate and trim the last name
  const handleLastNameChange = (text) => {
    const trimmedText = text
      .replace(/[^a-zA-Z\s]/g, '') 
      .replace(/\s{2,}/g, ' ')
      .slice(0, 15);

    setLastName(trimmedText);
  };

  // Function to validate and trim the bio
  const handleBioChange = (text) => {
    const trimmedText = text.slice(0, 140);
    setBio(trimmedText);
  };

  // Dashboard.js (Make sure bio is saved with the other data)
  const handleSaveUserInfo = async () => {
    if (firstName.trim() === '' || lastName.trim() === '') {
      Alert.alert('Invalid input', 'First and last names cannot be empty.');
      return;
    }

    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('users').doc(userId).update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(), // Ensure bio is passed here correctly
      });
      alert('User information saved successfully!');
    } catch (error) {
      setErrorMessage('Error saving user information: ' + error.message);
    }
  };

  return (
    <DashboardUI
      firstName={firstName}
      lastName={lastName}
      email={email}
      bio={bio}
      profilePic={profilePic}
      errorMessage={errorMessage}
      setFirstName={handleFirstNameChange}
      setLastName={handleLastNameChange}
      setBio={handleBioChange}
      handleSaveUserInfo={handleSaveUserInfo}
    />
  );
};

export default Dashboard;
