import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ImagePicker.style';

const UploadMediaFileView = ({ 
  image, 
  loadingProfilePic, 
  isModalVisible, 
  uploading, 
  setIsModalVisible, 
  pickImage, 
  uploadMedia 
}) => {
  return (
    <SafeAreaView style={styles.innerContainer}>
      <View style={styles.imageContainer}>
        {loadingProfilePic ? (
          <ActivityIndicator size="large" color="#026efd" />
        ) : image ? (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Image source={{ uri: image }} style={styles.profileImage} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.noImageText}>No profile picture</Text>
        )}
      </View>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: image }} style={styles.modalImage} />
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Ionicons name="image" size={30} color="#8A2BE2" />
          <Text style={styles.iconButtonText}>Pick</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadMedia} style={styles.iconButton} disabled={uploading}>
          <Ionicons name="cloud-upload" size={30} color={uploading ? '#555' : '#8A2BE2'} />
          <Text style={styles.iconButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UploadMediaFileView;
