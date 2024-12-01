import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground, ActionSheetIOS, Modal, Platform, TextInput} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/ProfileDashboard.style';
import { MaterialIcons } from '@expo/vector-icons';
import backgroundImage from '../../assets/background.png';
import placeholderImage from '../../assets/users/userDefault.png'
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const UserProfileUI = ({ 
  userData, 
  currentUserId, 
  userListings, 
  followersCount, 
  isFollowing, 
  toggleFollow, 
  blockUser, 
  isFollowingLoading, 
  showReportModal, 
  setShowReportModal, 
  reportType, 
  setReportType, 
  reportComment, 
  setReportComment, 
  isSubmittingReport, 
  handleReportSubmit,
  showModal,
  setShowModal,
  loadingListings,
  handleCloseModal,
  loading,
  currentUserRole,
  banUser
}) => {
  const navigation = useNavigation();
  const { uid, firstName, lastName, role, profilePic, email, bio, completedTransactions } = userData; // Destructure userData
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const handleBlockUser = () => {
  blockUser(userData.uid); // Assuming userData contains the user ID to block
};

  const handleImagePress = () => {
    setIsImageModalVisible(true);
  };

  
const handleOptionsPress = () => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Report", "Block User"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          setShowReportModal(true); // Open report modal on iOS
        } else if (buttonIndex === 2) {
          // Pass userId to block
          blockUser(userData.uid, userData);
        }
      }
    );
  } else {
    setShowModal(true); // Open modal for Android
  }
};


  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ImageBackground source={backgroundImage} style={styles.background}>
          {/* Main ScrollView */}
          <ScrollView>
            {/* Profile Header Section */}
                {/* Three-dot Icon */}
        {currentUserId !== uid && (
          <TouchableOpacity
            style={styles.optionsIcon}
            onPress={handleOptionsPress}
          >
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        )}
            <View  style={styles.container}>
            
            <View style={styles.header}>
              <TouchableOpacity onPress={handleImagePress}>
              <Image 
                source={profilePic ? { uri: profilePic } : placeholderImage} 
                style={styles.profilePic} 
              />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
                <Text style={styles.role}>{role}</Text>
                <Text style={styles.followersCount}>{`${followersCount} Followers`}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  currentUserId === uid && styles.followButtonDisabled,
                ]}
                onPress={toggleFollow}
                disabled={isFollowingLoading || currentUserId === uid}
              >
                {isFollowingLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.followButtonText}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              <Text style={styles.emailText}>Email: {email}</Text>
              <Text style={styles.uidText}>ID: {uid}</Text>
              <Text style={styles.transactionText}>
                Completed Transactions: {completedTransactions}
              </Text>
            </View>

            {/* Bio Section */}
            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{bio || "Bio not provided"}</Text>
            </View>
            </View>
            {/* User Product/Services Listings */}
            <View style={styles.listingsContainer}>
              <Text style={styles.listingTitle}>User Product/Services:</Text>
              {loadingListings ? (
                <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
              ) : (
                <FlatList
                  data={userListings}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalFlatList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listingItem}
                      onPress={() => {
                        const routes = navigation.getState().routeNames; // Get all registered route names
                        if (routes.includes('AdminItem')) {
                          navigation.navigate('AdminItem', { product: item });
                        } else if (routes.includes('ProductDetail')) {
                          navigation.navigate('ProductDetail', { product: item });
                        } else {
                          console.warn('No matching route found for ProductDetail or AdminItemView.');
                        }
                      }}
                    >
                      <Image source={{ uri: item.imageUrl }} style={styles.listingImage} />
                      <Text style={styles.listingTitle}>{item.name}</Text>
                      <Text style={styles.createdAtText}>Created: {item.createdAtReadable}</Text>
                      {item.type === 'product' ? (
                        <Text style={[styles.typeLabel, styles.typeLabelRight]}>Product</Text>
                      ) : (
                        <Text style={[styles.typeLabel, styles.typeLabelLeft]}>Service</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      {userListings.length === 0 ? 'No listings available.' : ''}
                    </Text>
                  }
                />
              )}
            </View>
          </ScrollView>

          {/* Report Modal */}
          <Modal
            visible={showReportModal}
            animationType="none"
            transparent={true}
            onRequestClose={() => setShowReportModal(false)}
          >
            <BlurView intensity={90} tint="dark" style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Report {firstName} {lastName}</Text>
                <Text style={styles.modalDescription}>Please select a reason for reporting:</Text>
                <Picker
                  selectedValue={reportType}
                  onValueChange={(value) => setReportType(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select report type" value="" />
                  <Picker.Item label="Sexual or Violent Content" value="sexual or violent content" />
                  <Picker.Item label="Spam" value="spam" />
                  <Picker.Item label="Mismatched Info" value="mismatched info" />
                  <Picker.Item label="Others" value="others" />              
                </Picker>
                <TextInput
                  style={styles.reportCommentInput}
                  placeholder="Additional info (optional)"
                  value={reportComment}
                  onChangeText={setReportComment}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleReportSubmit}
                    disabled={isSubmittingReport}
                  >
                    {isSubmittingReport ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Report</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowReportModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>

            {/* Options Modal for Android */}
            <Modal
              visible={showModal}
              transparent
              animationType="fade"
              onRequestClose={handleCloseModal}
            >
              <BlurView intensity={90} style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <LinearGradient
                    colors={['#fff', '#f3f4f6']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.modalGradient}
                  />
                  <Text style={styles.modalTitle}>Options</Text>
                  
                  {/* Report Option */}
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setShowReportModal(true); // Open report modal for Android
                      handleCloseModal(); // Close options modal
                    }}
                  >
                    <Text style={styles.modalOptionText}>Report</Text>
                  </TouchableOpacity>
                  
                  {/* Block User Option */}
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      if (!loading) {
                        blockUser(userData.uid, userData);
                        handleCloseModal(); // Close options modal
                      }
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#E53E3E" />
                    ) : (
                      <Text style={[styles.modalOptionText, { color: '#E53E3E' }]}>Block User</Text>
                    )}
                  </TouchableOpacity>

                  {/* Ban User Option */} 
                  {currentUserRole === 'Admin' && (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => {
                        if (!loading) {
                          banUser(userData.uid, userData); // Call the banUser function
                          handleCloseModal(); // Close the options modal
                        }
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#E53E3E" />
                      ) : (
                        <Text style={[styles.modalOptionText, { color: '#E53E3E' }]}>Ban User</Text>
                      )}
                    </TouchableOpacity>
                  )}
                               
                  {/* Cancel Option */}
                  <TouchableOpacity style={styles.modalCancelOption} onPress={handleCloseModal}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Modal>

          {/* Enlarged Profile Image Modal */}
          <Modal
            visible={isImageModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setIsImageModalVisible(false)}
          >
            <BlurView intensity={80} tint="dark" style={styles.imageModalContainer}>
              <TouchableOpacity style={styles.imageModalClose} onPress={() => setIsImageModalVisible(false)}>
                <MaterialIcons name="close" size={30} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: profilePic }} style={styles.imageModalContent} />
            </BlurView>
          </Modal>

          </ImageBackground>
        </View>
  );
};

export default UserProfileUI;