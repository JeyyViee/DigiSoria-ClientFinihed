import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { db } from '../firebase/firebaseUserConfig'; // Firebase configuration
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Icon library
import * as WebBrowser from 'expo-web-browser'; // Expo Web Browser module
import { getStorage, ref, deleteObject } from 'firebase/storage'; // Firebase Storage
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native'; // React Navigation hook
import backgroundImage from '../assets/background.png'

const SimpleNotification = ({ route }) => {
  const { email } = route.params;
  const [clientDocs, setClientDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Get navigation instance

  useEffect(() => {
    if (email) {
      console.log('Email prop received:', email);

      const unsubscribe = db
        .collection('sentToSellers')
        .where('sellerEmail', '==', email)
        .onSnapshot((clientQuerySnapshot) => {
          let allDocs = [];
          clientQuerySnapshot.forEach((doc) => {
            allDocs.push({ id: doc.id, ...doc.data() });
          });

          db.collection('sentToSellers')
            .where('email', '==', email)
            .orderBy('__name__')
            .get()
            .then((emailQuerySnapshot) => {
              emailQuerySnapshot.forEach((doc) => {
                allDocs.push({ id: doc.id, ...doc.data() });
              });

              allDocs.sort((a, b) => b.id.localeCompare(a.id));

              setClientDocs(allDocs);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching email documents:', error);
              setLoading(false);
            });
        });

      return () => unsubscribe();
    }
  }, [email]);

  const toggleMarkRead = (docId, currentStatus) => {
    // Toggle the `markRead` field in Firestore
    db.collection('sentToSellers')
      .doc(docId)
      .update({
        markRead: !currentStatus, // Toggle the status (true to false or false to true)
      })
      .then(() => {
        console.log('Document updated with markRead:', !currentStatus);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
  };

  const openFileInBrowser = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening file URL:', error);
    }
  };

  const deleteNotification = async (docId, fileURL) => {
    try {
      if (fileURL) {
        const storage = getStorage();
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);
        console.log('File deleted successfully from Firebase Storage');
      }

      await db.collection('sentToSellers').doc(docId).delete();
      console.log('Notification document deleted successfully');

      setClientDocs((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
      <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="#333" />
      </TouchableOpacity>

      <Text style={styles.notificationTitle}>Notifications</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.detailsContainer}>
          {clientDocs.length === 0 ? (
            <Text style={styles.noDataText}>No notifications found.</Text>
          ) : (
            clientDocs.map((doc, index) => (
              <View key={index} style={styles.notificationCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {doc.sellerEmail ? 'Transaction' : 'Account Banned'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleMarkRead(doc.id, doc.markRead || false)}
                    style={styles.markReadButton}
                  >
                    <Icon
                      name={doc.markRead ? 'check-circle' : 'circle'}
                      size={30}
                      color={doc.markRead ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  {doc.price && <Text style={styles.contentTextSmall}>Price: {doc.price}</Text>}
                  {doc.transactionId && <Text style={styles.contentTextSmall}>{doc.transactionId}</Text>}
                  {doc.sentAt && (
                    <Text style={styles.contentTextSmall}>Date:
                      {format(doc.sentAt.toDate(), 'MM/dd/yyyy')}
                    </Text>
                  )}

                  {doc.fileURL && (
                    <TouchableOpacity
                      style={styles.fileIconContainer}
                      onPress={() => openFileInBrowser(doc.fileURL)}
                    >
                      <Icon name="file-download" size={30} color="#007bff" />
                      <Text style={styles.fileIconText}>Download Receipt</Text>
                    </TouchableOpacity>
                  )}

                  {doc.email === email && (
                    <>
                      {doc.reason && <Text style={styles.contentReasonSmall}>{doc.reason}</Text>}
                    </>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => deleteNotification(doc.id, doc.fileURL)}
                    style={styles.deleteButton}
                  >
                    <Icon name="trash-can" size={30} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the background covers the entire screen
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  notificationTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  notificationCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    marginVertical: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  markReadButton: {
    padding: 8,
  },
  fileIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  fileIconText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  deleteButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  contentTextSmall: {
    fontSize: 12, // Smaller font size
    color: '#555',
    marginBottom: 3, // Smaller space between fields
  },
  contentReasonSmall: {
    fontSize: 16, // Larger font size for emphasis
    color: 'orange',
    fontWeight: 'bold', // Bold to make the warning stand out
  },
});

export default SimpleNotification;
