import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { firebase, db } from '../firebase/firebaseUserConfig';
import UserProfileUI from './ui/ProfileDashboardUI';
import { useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for Android modal
  const [showReportModal, setShowReportModal] = useState(false); // New report modal
  const [reportType, setReportType] = useState(''); // For selected report type
  const [reportComment, setReportComment] = useState(''); // For additional report info
  const [hasReported, setHasReported] = useState(false); // To restrict multiple reports on same account
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false); // <-- Loading state for follow action
  const [completedTransactions, setCompletedTransactions] = useState(0); // New state for completed transactions
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  
  const route = useRoute();
  const { userId } = route.params;

  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    const fetchUserListings = async () => {
      setLoadingListings(true); // Set loading to true before fetching
      try {
        const listingsSnapshot = await firebase.firestore()
          .collection('products_services')
          .where('uid', '==', userId) // Ensure uid matches the userId
          .get();

        const listings = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserListings(listings);
      } catch (error) {
        console.error("Error fetching user listings:", error);
      } finally {
        setLoadingListings(false); // Set loading to false after fetching completes
      }
    };

    fetchUserListings();
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users').doc(userId).get();
        if (userSnapshot.exists) {
          setUserData(userSnapshot.data());
        } else {
          console.error("User does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listingsSnapshot = await firebase.firestore()
          .collection('products_services')
          .where('uid', '==', userId) // Ensure uid matches the userId
          .get();

        const listings = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Listings:", listings); // Debugging log
        setUserListings(listings);
      } catch (error) {
        console.error("Error fetching user listings:", error);
      }
    };

    if (userData) fetchUserListings();
  }, [userData, userId]);

  // Fetch initial follow status and followers count
  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        const userRef = firebase.firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const followers = userDoc.data().followers || [];
          setFollowersCount(followers.length);
          setIsFollowing(followers.includes(currentUserId));
          setCompletedTransactions(userDoc.data().completedTransaction || 0);
        } else {
          console.error("User does not exist.");
        }
      } catch (error) {
        console.error("Error fetching followers count:", error);
      }
    };
    fetchFollowersCount();
  }, [userId, currentUserId]);

  useEffect(() => {
    const fetchRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUserId)); // Fetch current user's doc
      if (userDoc.exists()) {
        setCurrentUserRole(userDoc.data().role); // Set the role
      }
    };

    fetchRole();
  }, [currentUserId]);

  // Toggle follow/unfollow functionality
  const toggleFollow = async () => {
    if (!currentUserId) {
      Alert.alert("Error", "You need to be logged in to follow or unfollow users.");
      return;
    }

    setIsFollowingLoading(true); // Set loading state to true before starting follow action
    try {
      const currentUserRef = firebase.firestore().collection('users').doc(currentUserId); // Reference to the current user's document
      const followedUserRef = firebase.firestore().collection('users').doc(userId); // Reference to the followed user's document

      // Update following field for the current user
      const followingUpdate = isFollowing
        ? firebase.firestore.FieldValue.arrayRemove(userId) // Remove from following
        : firebase.firestore.FieldValue.arrayUnion(userId); // Add to following

      // Update followers field for the followed user
      const followersUpdate = isFollowing
        ? firebase.firestore.FieldValue.arrayRemove(currentUserId) // Remove from followers
        : firebase.firestore.FieldValue.arrayUnion(currentUserId); // Add to followers

      // Batch update to ensure atomicity
      const batch = firebase.firestore().batch();

      // Update the current user's following array
      batch.update(currentUserRef, { following: followingUpdate });
      
      // Update the followed user's followers array
      batch.update(followedUserRef, { followers: followersUpdate });

      // Commit the batch update
      await batch.commit();

      // Update local state
      setIsFollowing(!isFollowing);
      Alert.alert("Success", isFollowing ? `You unfollowed ${userData.firstName} ${userData.lastName}` : `You are now following ${userData.firstName} ${userData.lastName}`);
    } catch (error) {
      console.error("Error updating following/followers:", error);
      Alert.alert("Error", "Unable to update follow status. Please try again.");
    } finally {
      setIsFollowingLoading(false); // Reset loading state after follow action completes
    }
  };


  // Block user by adding them to current user's 'blockedUsers' list in Firestore
const blockUser = async (userIdToBlock, userData) => {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser) {
    Alert.alert("Error", "No current user logged in.");
    return;
  }

  const currentUserRef = firebase.firestore().collection('users').doc(currentUser.uid);
  
  try {
    setLoading(true); // Start loading

    // Check if the user is already blocked
    const doc = await currentUserRef.get();
    const blockedUsers = doc.data()?.blockedUsers || [];
    if (blockedUsers.includes(userIdToBlock)) {
      Alert.alert("Already Blocked", `${userData?.firstName} ${userData?.lastName} is already blocked.`);
      setLoading(false); // Stop loading
      return;
    }

    // Log the values to debug
    console.log("User ID to Block:", userIdToBlock); // Check this value
    console.log("Current User ID:", currentUser.uid); // Check this value

    // Check for valid IDs
    if (!userIdToBlock || typeof userIdToBlock !== 'string') {
      Alert.alert("Error", "Invalid user ID to block.");
      return;
    }

    // Add the blocked user to the current user's blocked list
    await currentUserRef.update({
      blockedUsers: firebase.firestore.FieldValue.arrayUnion(userIdToBlock)
    });

    // Update the blockedUsers field in the blocked user's products
    const productsSnapshot = await firebase.firestore().collection('products_services').where('uid', '==', userIdToBlock).get();
    const batch = firebase.firestore().batch();
    productsSnapshot.docs.forEach(doc => {
      // Make sure currentUser.uid is valid before using it
      if (currentUser.uid) {
        batch.update(doc.ref, {
          blockedUsers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });
      } else {
        console.error("Current User ID is invalid");
      }
    });
    
    await batch.commit();

    Alert.alert("User Blocked", `You have blocked ${userData?.firstName} ${userData?.lastName}.`);
  } catch (error) {
    console.error("Error blocking user:", error);
    Alert.alert("Error", "Unable to block user. Please try again.");
  } finally {
    setLoading(false); // Stop loading
    setShowModal(false); // Close the modal if applicable
  }
};

  // Inside handleOptionsPress function
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
            blockUser();
          }
        }
      );
    } else {
      setShowModal(true); // Open modal for Android
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

const handleReportSubmit = async () => {
  if (!reportType) {
    Alert.alert("Error", "Please select a report type.");
    return;
  }

  setIsSubmittingReport(true); // Start loading

  try {
    // Retrieve current user's reportedUsers array
    const currentUserDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
    const reportedUsers = currentUserDoc.data()?.reportedUsers || [];

    // Check if the user has already reported this user
    if (reportedUsers.includes(userData.uid)) {
      Alert.alert("Report Already Submitted", `You have already reported ${userData.firstName} ${userData.lastName}.`);
      return;
    }

    // Proceed with reporting the user
    const reportRef = firebase.firestore().collection('reports').doc();
    await reportRef.set({
      reportedUserId: userData.uid,
      reportedBy: currentUserId,
      reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
      reportType,
      reportComment,
      reporterEmail: firebase.auth().currentUser.email,
      reportedEmail: userData.email,
    });

    // Add reported user to current user's reportedUsers array
    await firebase.firestore().collection('users').doc(currentUserId).update({
      reportedUsers: firebase.firestore.FieldValue.arrayUnion(userData.uid),
    });

    setHasReported(true);

    setShowReportModal(false);
    Alert.alert("Report Submitted", `Your report for ${userData.firstName} ${userData.lastName} has been submitted.`);
  } catch (error) {
    console.error("Error submitting report:", error);
    Alert.alert("Error", "Unable to submit report. Please try again.");
  } finally {
    setIsSubmittingReport(false); // End loading
  }
};

const banUser = async (userIdToBan, userData) => {
  const currentUser = firebase.auth().currentUser;

  if (!currentUser) {
    Alert.alert("Error", "No current user logged in.");
    return;
  }

  const targetUserRef = firebase.firestore().collection('users').doc(userIdToBan);

  try {
    setLoading(true); // Start loading

    // Check if the user ID is valid
    if (!userIdToBan || typeof userIdToBan !== 'string') {
      Alert.alert("Error", "Invalid user ID to ban.");
      setLoading(false);
      return;
    }

    // Fetch the target user's document from the server (avoid caching)
    const targetUserDoc = await targetUserRef.get({ source: 'server' });
    const targetUserData = targetUserDoc.data();

    if (!targetUserData) {
      Alert.alert("Error", "User not found.");
      setLoading(false);
      return;
    }

    // Check if the user is already banned
    if (targetUserData.isBanned === true) {
      Alert.alert("Already Banned", `${userData?.firstName} ${userData?.lastName} is already banned.`);
      setLoading(false);
      return;
    }

    // Reset the report count to zero
    await targetUserRef.update({ reportCount: 0 });

    // Update the target user's document to set isBanned to true
    await targetUserRef.update({ isBanned: true });

    console.log(`${userData?.firstName} ${userData?.lastName} has been banned.`);

    // Prepare the data to write in the role-specific collection
    const banReason = "You are banned because of not following the appropriate profile. Please message the support team for an appeal.";
    const notificationData = {
      email: targetUserData.email,
      uid: userIdToBan,
      reason: banReason,
    };

    // Determine the collection based on the user's role
    const role = targetUserData.role; // Assuming `role` exists in the user data
    const collectionName = role === "Seller" ? "sentToSellers" : "sentToClients";

    // Write the notification to the appropriate collection
    await firebase.firestore().collection(collectionName).add(notificationData);

    console.log(`Notification sent to ${role}:`, notificationData);

    Alert.alert("User Banned", `You have banned ${userData?.firstName} ${userData?.lastName}.`);
  } catch (error) {
    console.error("Error banning user:", error);
    Alert.alert("Error", "Unable to ban user. Please try again.");
  } finally {
    setLoading(false); // Stop loading
    setShowModal(false); // Close the modal if applicable
  }
};

  return userData ? (
    <UserProfileUI 
      userData={{ ...userData, uid: userId }} 
      currentUserId={currentUserId} 
      userListings={userListings} 
      followersCount={followersCount}
      isFollowing={isFollowing}
      completedTransactions={completedTransactions}
      toggleFollow={toggleFollow}
      blockUser={(userId) => blockUser(userId, userData)}
      isFollowingLoading={isFollowingLoading}
      showReportModal={showReportModal}
      setShowReportModal={setShowReportModal}
      reportType={reportType}
      setReportType={setReportType}
      reportComment={reportComment}
      setReportComment={setReportComment}
      hasReported={hasReported}
      setHasReported={setHasReported}
      isSubmittingReport={isSubmittingReport}
      setIsSubmittingReport={setIsSubmittingReport}
      handleReportSubmit={handleReportSubmit}
      handleOptionsPress={handleOptionsPress}
      showModal={showModal}
      setShowModal={setShowModal}
      loadingListings={loadingListings}
      handleCloseModal={handleCloseModal}
      loading={loading}
      banUser={banUser}
      currentUserRole={currentUserRole}
    />
  ) : null;
};

export default ProfileDashboard;