import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { format } from 'date-fns'; // Import date-fns to format the timestamp

const MessageUI = ({
  loading,
  loadingMessages,
  errorMessage,
  users,
  selectedUser,
  setSelectedUser,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  styles,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Loading State */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#800080" />
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.chatTitle}>Chat</Text>

          {/* User List Section */}
          <View style={styles.userListContainer}>
            <Text style={styles.selectUserText}>Select a user to chat:</Text>
            <FlatList
              data={users}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedUser(item)}
                  style={[styles.userItem, item === selectedUser && styles.selectedUserItem]}
                >
                  <Image
                    source={
                      item.profilePic
                        ? { uri: item.profilePic }
                        : require('../../assets/users/userDefault.png')
                    }
                    style={styles.profileImageSmall}
                  />
                  {item.unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationText}>
                        {item.unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Messages Section */}
        {selectedUser ? (
          <View style={styles.messageContainer}>
            {loadingMessages ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#800080" />
              </View>
            ) : messages.length === 0 ? (
              <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
            ) : (
              <FlatList
                data={messages}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.message,
                      item.senderId === selectedUser?.id
                        ? styles.otherMessage
                        : styles.ownMessage,
                    ]}
                  >
                    {item.senderId === selectedUser?.id && (
                      <Image
                        source={
                          selectedUser.profilePic
                            ? { uri: selectedUser.profilePic }
                            : require('../../assets/users/userDefault.png')
                        }
                        style={styles.profileImageSmall}
                      />
                    )}
                    <View style={styles.messageContent}>
                      <Text style={styles.messageText}>{item.text}</Text>
                      {item.createdAt && (
                        <Text style={styles.messageDate}>
                          {format(item.createdAt.toDate(), 'MM/dd/yyyy hh:mm a')}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        ) : (
          <Text style={styles.welcomeText}>Please select a user to start chatting.</Text>
        )}

          {/* Input Section */}
          {selectedUser && (
            <View style={styles.inputSection}>
              <TextInput
                style={[styles.input, { flexGrow: 1, maxHeight: 100 }]}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline={true}
                numberOfLines={3}
              />

              <TouchableOpacity
                onPress={sendMessage}
                style={styles.sendButton}
                disabled={!newMessage.trim()}
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default MessageUI;
