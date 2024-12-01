// Settings.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    width: '90%',
    backgroundColor: '#E6E6FA',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 20,
    alignSelf: 'center',
    marginVertical: '15%',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#808080',
  },
  settingsSection: {
    width: '90%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingsText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#9966CC',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 15,
  },
  iconButtonText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
    labelContainer: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#E6E6FA',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
  width: '90%',
  height: '80%',
  },
  closeButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#8A2BE2',
  borderRadius: 5,
  },
  closeButtonText: {
  color: '#fff',
  fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the cart button
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', // Align content to the left
    marginVertical: 10,
  },
  roleText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  cartButton: {
    marginLeft: 10, // Add spacing between the text and the icon
  },
});
