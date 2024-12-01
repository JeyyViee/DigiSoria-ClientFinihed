import React, { useState, useEffect } from 'react';
import { firebase } from '../firebase/firebaseUserConfig';
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import MessageUI from './ui/MessageUI';
import styles from './styles/Message.styles'; 
import { useFocusEffect } from '@react-navigation/native';

const Message = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sellerId, sellerEmail } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // Fetch user data and handle email verification via Firebase Auth
useEffect(() => {
  const fetchUsers = async () => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      setErrorMessage('User is not authenticated');
      setLoading(false);
      return;
    }

    if (!currentUser.emailVerified) {
      setErrorMessage('Your email is not verified. Please verify your email.');
      setLoading(false);
      return;
    }

    setUserEmail(currentUser.email);
    setCurrentUserId(currentUser.uid);

    const userQuery = query(
      collection(firebase.firestore(), 'users'),
      where('verification_status', '==', true)
    );

    const unsubscribeUsers = onSnapshot(
      userQuery,
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out users with the 'admin' role
        const verifiedUsers = usersData
          .filter((userData) => userData.id !== currentUser.uid && userData.role !== 'Admin'); // Exclude admin users

        if (verifiedUsers.length > 0) {
          setUsers(verifiedUsers);

          // Pre-select the user if sellerId or sellerEmail matches
          const matchingUser = verifiedUsers.find(
            (user) => user.id === sellerId || user.email === sellerEmail
          );
          if (matchingUser) {
            setSelectedUser(matchingUser);
          }

          setErrorMessage('');
        } else {
          setErrorMessage('No other verified users found.');
        }

        setLoading(false);
      },
      (error) => {
        console.log('Error fetching users:', error);
        setErrorMessage('Failed to fetch users');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUsers();
    };
  };

  fetchUsers();
}, [sellerId, sellerEmail]);

  useEffect(() => {
    if (selectedUser) {
      setLoadingMessages(true);
      const q = query(
        collection(firebase.firestore(), 'chats'),
        where('participants', 'array-contains', currentUserId),
        orderBy('createdAt', 'asc')
      );

      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (msg) =>
              (msg.senderId === currentUserId && msg.recipientId === selectedUser.id) ||
              (msg.senderId === selectedUser.id && msg.recipientId === currentUserId)
          );

        setMessages(messagesData);
        setLoadingMessages(false);
      });

      return () => {
        unsubscribeMessages();
      };
    } else {
      setMessages([]);
      setLoadingMessages(false);
    }
  }, [selectedUser, currentUserId]);

  // Reset selectedUser when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset selectedUser when the screen is focused
      setSelectedUser(null);
      setMessages([]);
      navigation.setParams({ sellerId: null, sellerEmail: null }); // Reset params

      return () => {
        // Optional cleanup when screen goes out of focus
      };
    }, [])
  );

  const sendMessage = async () => {
    if (newMessage.trim() === '') {
      setErrorMessage('Please enter a message');
      return;
    }

    if (!selectedUser) {
      setErrorMessage('Please select a user to send a message');
      return;
    }

    try {
      await addDoc(collection(firebase.firestore(), 'chats'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        recipientId: selectedUser.id,
        participants: [currentUserId, selectedUser.id],
      });
      setNewMessage('');
    } catch (error) {
      setErrorMessage('Error sending message: ' + error.message);
    }
  };

  return (
    <MessageUI
      loading={loading}
      loadingMessages={loadingMessages}
      errorMessage={errorMessage}
      users={users}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      sendMessage={sendMessage}
      styles={styles}
    />
  );
};

export default Message;
