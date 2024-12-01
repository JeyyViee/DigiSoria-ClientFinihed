// UploadMediaFile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebase/firebaseUserConfig';
import * as FileSystem from 'expo-file-system';
import UploadMediaFileView from './ui/ImagePickerUI';

const UploadMediaFile = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return console.error("User not authenticated");

      try {
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        if (userDoc.exists && userDoc.data().profilePic) {
          setImage(userDoc.data().profilePic);
        }
      } catch (error) {
        console.error("Error fetching profile picture: ", error);
      } finally {
        setLoadingProfilePic(false);
      }
    };
    fetchProfilePic();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    if (!image) return Alert.alert('Error', 'No image selected');
    setUploading(true);

    try {
      let blob;
      if (image.startsWith('http')) {
        Alert.alert('Error', 'This image is already uploaded');
        setUploading(false);
        return;
      }

      const { uri } = await FileSystem.getInfoAsync(image);
      blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const userId = firebase.auth().currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const ref = firebase.storage().ref().child(`profilePics/${userId}`);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      await firebase.firestore().collection('users').doc(userId).update({ profilePic: downloadURL });

      setImage(downloadURL);
      Alert.alert('Success', 'Photo Uploaded!');
    } catch (error) {
      console.error("Upload error: ", error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading the image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadMediaFileView
      image={image}
      loadingProfilePic={loadingProfilePic}
      isModalVisible={isModalVisible}
      uploading={uploading}
      setIsModalVisible={setIsModalVisible}
      pickImage={pickImage}
      uploadMedia={uploadMedia}
    />
  );
};

export default UploadMediaFile;
