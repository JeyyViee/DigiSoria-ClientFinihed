import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Adjust the image scaling
    justifyContent: 'center', // Center content if needed
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  textInputStyle: {
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#f9f9f9', // Adjust if using colors.background from your theme
    fontSize: 14,         // Adjust font size
    height: 40,           // Set a smaller height
    paddingVertical: 4,   // Reduce vertical padding for a compact look
    paddingLeft: 0,       // Remove left padding
    paddingHorizontal: 0, // Optional: Set horizontal padding to zero if needed
    marginVertical: 8,    // Optional: Adjust the margin as needed
  },
  pickerContainer: {
    marginBottom: 15,
  },
  buttonContent: {
    height: 40,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: '#A77BCA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    color: '#333',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imagePreviewWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A77BCA',
    marginBottom: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#A77BCA',
    borderRadius: 12,
    padding: 6,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#800080',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle dark overlay for text visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },



  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 8, // Reduced bottom margin
    paddingHorizontal: 0, // Remove extra padding around the container if any
  },
  label: {
    fontSize: 16,
    fontWeight: '500', // Slightly lighter font weight
    marginBottom: 4,   // Smaller margin below the label
    color: '#333',
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 10,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  charCounter: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },


nextButton: {
  backgroundColor: '#C8A2D3',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  elevation: 2,
  // No opacity here
},


  nextButtonActive: {
    backgroundColor: '#9966CC', // Amethyst color for active button
    opacity: 1, // Full opacity for active button
  },

nextButtonDisabled: {
  backgroundColor: '#D3D3D3',
  opacity: 0.5, // Low opacity only for the disabled state
},


  nextButtonText: {
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },


  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A77BCA',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#A77BCA',
  },
  inactiveButton: {
    backgroundColor: '#FFFFFF',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#A77BCA',
  },


  tagInput: {
    backgroundColor: '#f5f5f5', // Light gray background for input
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3', // Light border color
    fontSize: 16,
    color: '#333', // Dark text color
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#ff4d4d', // Red border for error state
  },
  addButton: {
    backgroundColor: '#8A2BE2', // Violet color for button
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // For shadow effect on Android
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#D8BFD8', // Light violet for tags
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1, // Optional shadow for tags on Android
  },
  tagText: {
    fontSize: 14,
    color: '#6A5ACD', // Darker violet for tag text
    marginRight: 8,
  },
  removeTagButton: {
    backgroundColor: '#8B0000', // Red color for tag removal button
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  removeTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 5,
  },


  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A77BCA',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#A77BCA',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darkened overlay for better visibility
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 20,
    alignItems: 'center',
    elevation: 10, // Drop shadow
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#A77BCA',
    borderRadius: 20,
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    justifyContent: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalItemActive: {
    backgroundColor: '#A77BCA',
    borderRadius: 8,
  },
  modalItemTextActive: {
    color: '#fff',
  },



  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A77BCA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#A77BCA',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },

  deliveryTimeButton: {
    padding: 10,
    borderWidth: 1,                // Outline width
    borderColor: '#A77BCA',         // Outline color (purple shade)
    borderRadius: 8,                // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',        // Optional: background color
  },
  deliveryTimeText: {
    color: '#555',                   // Text color
    fontSize: 16,
  },

  documentItem: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentSize: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#9966CC',
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noDocumentsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },

  pickDocumentButton: {
    paddingVertical: 12, // Adds more vertical padding for a larger clickable area
    paddingHorizontal: 20, // Adds horizontal padding for balanced spacing
    backgroundColor: '#A77BCA', // Background color to make the button stand out
    borderRadius: 8, // Rounded corners for a modern look
    alignItems: 'center', // Centers the text within the button
    justifyContent: 'center', // Ensures the content is centered
    elevation: 3, // Adds shadow for iOS and Android
  },
  pickDocumentText: {
    color: 'white', // White text for better contrast
    fontSize: 16, // Slightly larger text for readability
    fontWeight: 'bold', // Bold text to make it more prominent
  },


  pickButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#A77BCA', // A soft purple for the button
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  videoItem: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  videoSize: {
    fontSize: 12,
    color: '#777',
  },
  videoContainer: {
    flex: 1,
    padding: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
});

export default styles;
