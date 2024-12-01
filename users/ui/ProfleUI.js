import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native';
import UploadMediaFile from '../../src/ImagePicker';
import styles from '../styles/Profile.styles';
import Header from '../../components/Header'

const DashboardUI = ({ firstName, lastName, email, bio, profilePic, errorMessage, setFirstName, setLastName, handleSaveUserInfo, setBio }) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveUserInfo = async () => {
    setIsSaving(true);
    await handleSaveUserInfo();
    setIsSaving(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header/>
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {/* Profile Picture Section */}
            <UploadMediaFile profilePic={profilePic} />

            {/* Input Fields */}
            <Text style={styles.label}>Your Information</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Email"
              value={email}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline={true}
              numberOfLines={3}
            />
            
            <TouchableOpacity onPress={saveUserInfo} style={styles.saveButton} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Save User Information</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DashboardUI;
