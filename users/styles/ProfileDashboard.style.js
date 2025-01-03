import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followButtonDisabled: {
    backgroundColor: '#C0C0C0',
  },
  createdAtText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  bioContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    minHeight: 100,
    width: '100%',
  },
  bio: {
    color: '#666',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  listingItem: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  typeLabel: {
    position: 'absolute',
    top: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  typeLabelRight: {
    right: 10,
    backgroundColor: '#4B0082',
  },
  typeLabelLeft: {
    left: 10,
    backgroundColor: '#4B0082',
  },
  listingDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  additionalInfo: {
    marginBottom: 10,
  },
  emailText: {
    fontSize: 10,
    color: '#666',
    marginVertical: 2,
  },
  uidText: {
    fontSize: 10,
    color: '#666',
    marginVertical: 2,
  },
  transactionText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  listingsContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    width: '89%',
    alignSelf: 'center',
    paddingVertical: 8,
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginVertical: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  loadingText: {
    marginTop: 10,
    color: '#6200EE',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },
  horizontalFlatList: {
    paddingVertical: 10,
  },
  optionsIcon: {
    position: 'absolute',
    top: 25,
    right: 27,
    zIndex: 10,
    padding: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  reportCommentInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7A5C91',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9966CC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: '#e8e8e8',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 4,
  },
  modalCancelOption: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  modalGradient: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageModalContent: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  imageModalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  reportInputContainer: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  reportInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledButton: {
    marginTop: 8,
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    opacity: 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default styles;
