import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../firebase/firebaseUserConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import backgroundImage from '../assets/background.png';


const ReportedUsers = ({ navigation }) => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // New state for reply loading
  const [loadingStates, setLoadingStates] = useState({});
  const [disabledStates, setDisabledStates] = useState({});


  useEffect(() => {
    const fetchReportedUsers = async () => {
      setLoading(true);
      try {
        const reportsCollection = collection(db, 'reports');
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportedData = reportsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReportedUsers(reportedData);
        setFilteredUsers(reportedData);
      } catch (error) {
        console.error('Error fetching reported users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedUsers();
  }, []);

  const handleSearch = text => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredUsers(reportedUsers);
    } else {
      const lowercasedText = text.toLowerCase();
      const filtered = reportedUsers.filter(user =>
        (user.reportedEmail || '').toLowerCase().includes(lowercasedText) ||
        (user.reporterEmail || '').toLowerCase().includes(lowercasedText)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      Alert.alert('Error', 'Reply message cannot be empty.');
      return;
    }

    setIsSending(true);
    try {
      const sentToUsersCollection = collection(db, 'sentToUsers');
      await addDoc(sentToUsersCollection, {
        reporterEmail: selectedReport.reporterEmail,
        reportedEmail: selectedReport.reportedEmail,
        reportType: selectedReport.reportType,
        reportComment: selectedReport.reportComment,
        replyMessage,
        sentAt: new Date(),
      });

      const reportRef = doc(db, 'reports', selectedReport.id);
      await updateDoc(reportRef, { replied: true });

      Alert.alert('Success', 'Reply has been sent to the reporter.');
      setReportedUsers(prev =>
        prev.map(report =>
          report.id === selectedReport.id ? { ...report, replied: true } : report
        )
      );
      setFilteredUsers(prev =>
        prev.map(report =>
          report.id === selectedReport.id ? { ...report, replied: true } : report
        )
      );
      setModalVisible(false);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      Alert.alert('Error', 'Could not send the reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async id => {
    Alert.alert('Delete Report', 'Are you sure you want to delete this report?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const reportRef = doc(db, 'reports', id);
            await deleteDoc(reportRef);

            setReportedUsers(prev => prev.filter(report => report.id !== id));
            setFilteredUsers(prev => prev.filter(report => report.id !== id));
            Alert.alert('Success', 'The report has been deleted.');
          } catch (error) {
            console.error('Error deleting report:', error);
            Alert.alert('Error', 'Could not delete the report. Please try again.');
          }
        },
      },
    ]);
  };

  const handleIncrementReportCount = async (reportedEmail, id) => {
    setLoadingStates(prev => ({ ...prev, [id]: true })); // Set loading state for the button
    try {
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', reportedEmail));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        const currentReportCount = userDoc.data().reportCount || 0; // Default to 0 if undefined
        await updateDoc(userRef, { reportCount: currentReportCount + 1 });

        Alert.alert('Success', 'Report count incremented for the user.');
        setDisabledStates(prev => ({ ...prev, [id]: true })); // Disable the button after success
      } else {
        Alert.alert('Error', 'No user found with the provided email.');
      }
    } catch (error) {
      console.error('Error incrementing report count:', error);
      Alert.alert('Error', 'Could not increment the report count. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Reset loading state
    }
  };

const renderItem = ({ item }) => (
  <Card style={styles.card}>
    <Card.Content style={styles.cardContent}>
      <View style={styles.titleRow}>
        <Title style={styles.emailText}>{item.reportedEmail || 'N/A'}</Title>
        <MaterialIcons
          name="delete"
          size={24}
          color="red"
          onPress={() => handleDelete(item.id)}
          style={styles.deleteIcon}
        />
      </View>
      <Paragraph>
        <Text style={styles.boldText}>Report Type: </Text>
        {item.reportType || 'N/A'}
      </Paragraph>
      <Paragraph>
        <Text style={styles.boldText}>Comment: </Text>
        {item.reportComment || 'N/A'}
      </Paragraph>
      <Paragraph>
        <Text style={styles.boldText}>Reported By (ID): </Text>
        {item.reportedBy || 'N/A'}
      </Paragraph>
      <Paragraph>
        <Text style={styles.boldText}>Reporter Email: </Text>
        {item.reporterEmail || 'N/A'}
      </Paragraph>
      <Paragraph>
        <Text style={styles.boldText}>Reported At: </Text>
        {item.reportedAt
          ? new Date(item.reportedAt.seconds * 1000).toLocaleString()
          : 'N/A'}
      </Paragraph>
      {item.replied && (
        <Paragraph style={styles.repliedStatus}>
          <MaterialIcons name="check-circle" size={16} color="green" /> Replied
        </Paragraph>
      )}
    </Card.Content>
    <Card.Actions style={styles.cardActions}>
      <Button
        onPress={() =>
          navigation.navigate('ProfileDashboard', { userId: item.reportedUserId })
        }
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        View Details
      </Button>
      <Button
        onPress={() => {
          setSelectedReport(item);
          setModalVisible(true);
        }}
        style={styles.replyButton}
        labelStyle={styles.buttonText}
      >
        Reply
      </Button>
    <Button
      onPress={() => handleIncrementReportCount(item.reportedEmail, item.id)}
      style={[
        styles.incrementButton,
        disabledStates[item.id] && { backgroundColor: '#ccc' }, // Grey out the button if disabled
      ]}
      labelStyle={styles.buttonText}
      disabled={loadingStates[item.id] || disabledStates[item.id]} // Disable if loading or already disabled
    >
      {loadingStates[item.id] ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <MaterialIcons name="add" size={16} color="white" />
      )}
    </Button>
    </Card.Actions>
  </Card>
);

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.backgroundImage, { flex: 1 }]}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Reported Users</Text>

        {/* Search bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by email"
          value={searchText}
          onChangeText={handleSearch}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No reported users found.</Text>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Modal for replying */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setReplyMessage('');
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeading}>Reply to Reporter</Text>
              <Text style={styles.modalText}>
                Reporter Email: {selectedReport?.reporterEmail || 'N/A'}
              </Text>
              <Text style={styles.modalText}>
                Reported User: {selectedReport?.reportedEmail || 'N/A'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your reply here"
                value={replyMessage}
                onChangeText={setReplyMessage}
                multiline
              />
              <View style={styles.modalButtons}>
                <Button
                  onPress={handleReply}
                  style={styles.modalButton}
                  labelStyle={styles.buttonText}
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
                <Button
                  onPress={() => {
                    setModalVisible(false);
                    setReplyMessage('');
                  }}
                  style={styles.modalCancelButton}
                  labelStyle={styles.buttonText}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: '#E6E6FA',
  },
  boldText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#9966CC',
    borderRadius: 20,
  },
  replyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#E6E6FA',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 10,
  },
  modalCancelButton: {
    backgroundColor: '#F44336',
    flex: 1,
  },
incrementButton: {
  backgroundColor: '#4CAF50',
  borderRadius: 20,
  marginLeft: 10,
},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteIcon: {
    marginLeft: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36, // Adjust for better alignment
    justifyContent: 'center',
  },


});

export default ReportedUsers;
