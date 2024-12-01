// SettingsUI.js

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/Settings.styles';
import backgroundImage from '../../assets/background.png';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const SettingsUI = ({ email, handleResetPassword, role, handleSignOut, firstName, lastName, profilePic, loading, errorMessage }) => {
  const navigation = useNavigation();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [navigatingBlocked, setNavigatingBlocked] = React.useState(false);

  const onSignOut = async () => {
    setLoggingOut(true);
    try {
      await handleSignOut();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const onNavigateBlockedList = () => {
    setNavigatingBlocked(true);
    navigation.navigate('BlockedUserList');
    setNavigatingBlocked(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00e4d0" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ImageBackground source={backgroundImage} style={[styles.backgroundImage, { flex: 1 }]} resizeMode="cover">
      <Header/>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image
              source={profilePic ? { uri: profilePic } : require('../../assets/users/userDefault.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
            <Text style={styles.profileEmail}>{email || 'hello@digisoria.com'}</Text>
          </View>

          {/* Navigate to Blocked Users */}
        <TouchableOpacity 
          onPress={onNavigateBlockedList} 
          style={styles.iconButton}
          disabled={navigatingBlocked}
        >
          {navigatingBlocked ? (
            <ActivityIndicator size="small" color="#9966CC" />
          ) : (
            <Text style={styles.iconButtonText}>Blocked Users</Text>
          )}
        </TouchableOpacity>

          <TouchableOpacity onPress={handleResetPassword} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>Change Password</Text>
          </TouchableOpacity>

          {/* Display User Role and Cart Icon */}
          <View style={styles.iconButton}>
            <Text style={styles.roleText}>User Role: {role}</Text>

            {/* Conditionally render the cart icon based on role */}
            {role === 'Client' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ClientHistory');
                }}
                style={styles.cartIconContainer}
              >
                <Ionicons
                  name="cart" // Cart icon name from Ionicons
                  size={24} // Adjust size as needed
                  color="#8A2BE2" // Cart icon color
                />
              </TouchableOpacity>
            )}
          </View>


        <TouchableOpacity 
          onPress={onSignOut} 
          style={styles.logoutButton} 
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.logoutButtonText}>Log Out</Text>
          )}
        </TouchableOpacity>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </ImageBackground> 
    </SafeAreaView>
  );
};

export default SettingsUI;
