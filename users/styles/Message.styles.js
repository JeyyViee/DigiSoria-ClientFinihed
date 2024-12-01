import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E6E6FA',
  },
  input: {
    height: 'auto',
    minHeight: 50,
    maxHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  sendButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 25,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: '75%',
  },
  ownMessage: {
    backgroundColor: '#A77BEF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  userListContainer: {
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#8A2BE2',
    marginRight: 10,
  },
  selectedUserItem: {
    backgroundColor: '#00796b',
  },
  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    right: -5,
    top: -5,
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
noMessagesText: {
  fontSize: 16,
  color: '#888',
  textAlign: 'center',
  marginTop: 20,
},

});
