import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  additionalImagesContainer: {
    paddingVertical: 10,
    marginBottom: 20,
marginTop: 20,
  },
  additionalImagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  additionalImagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  additionalImagesFlatList: {
    paddingLeft: 16,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  additionalImageItem: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  link: {
    fontSize: 16,
    color: '#007AFF', // Link color
    textDecorationLine: 'underline', // Underline to indicate a link
    flexShrink: 1, // Prevent overlap with the container
    flexWrap: 'wrap', // Allow the text to wrap onto the next line if necessary
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  video: {
    width: '100%',
    height: 250,
    marginVertical: 10,
  },
  audioButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  audioWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10, // Rounded corners for the image
    overflow: 'hidden', // Ensure the image stays within the border
    elevation: 3, // Subtle shadow for a modern effect
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover', // Cover the entire image area
  },
  noImageText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#E6E6FA', // White background to contrast against main background
    borderRadius: 10,
    elevation: 3, // Subtle shadow to create depth
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333', // Darker text color for the title
    marginBottom: 10,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
    color: '#e74c3c', // Highlight price in a bright color
    marginBottom: 10,
  },
  sellerText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins_400Regular',
    color: '#2c3e50', // Use a darker shade for seller info
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 24, // Better line spacing for readability
    color: '#666', // Lighter color for secondary information
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,  // Rounded corners for the image
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff5c5c',  // Subtle red color for the close button
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controlIcon: {
    marginHorizontal: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  coolFont: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  videoFileName: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 5,
    marginRight: 35, // Add left margin for spacing
  },
  linkContainer: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f8f8f8', // Light background color
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 2, // For Android shadow
    transitionDuration: '200ms', // Smooth transition for hover effects
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow the text to take available space
    marginLeft: 8, // Space between icon and text
  },
  documentIcon: {
    marginRight: 8,
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  productTypeContainer: {
    flex: 1, // Allow productTypeContainer to take up remaining space
    marginLeft: 10,
    backgroundColor: '#e0e0e0', // Change the background color as needed
    borderRadius: 8, // Add rounded corners
    paddingVertical: 6, // Add vertical padding
    paddingHorizontal: 12, // Add horizontal padding
    alignItems: 'center', // Center text inside the container
    shadowColor: '#000', // Shadow properties
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  productTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
},


  videoWrapper: {
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: 200,
  },
    loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },


  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  filesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  fileCard: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  fileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fileIcon: {
    zIndex: 1,
  },
  fileLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

// Styles
lowerButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%', // Use 100% to span the full width of the parent
  height: 95, 
  paddingHorizontal: 10, // Add padding for spacing from edges
  paddingVertical: 5,
  backgroundColor: '#CCCCFF',
  borderRadius: 10,
  position: 'relative',
  bottom: 0, 
},
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  documentCard: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  documentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  documentLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

addToCartButton: {
  flexDirection: 'column',
  backgroundColor: '#800080',
  paddingVertical: 20, // Increase vertical padding for more height
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 4, // Keep this for width adjustment
  marginHorizontal: 8,
  minHeight: 60, // Set a minimum height explicitly
},



addToCartText: {
  color: '#fff',
  marginTop: 4, // Add space between the icon and text
  fontSize: 12, // Larger font size for better readability
  textAlign: 'center', // Center text alignment
  fontFamily: 'Poppins_400Regular',

},

reviewButton: {
  flexDirection: 'row',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  marginRight: 8,
},

reviewButtonText: {
  color: '#000',
  fontSize:  8,
},

messageButton: {
  flexDirection: 'row',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  marginRight: 8,
},

messageButtonText: {
  color: '#000',
  fontSize:  8,
},

// Container for the icon and text to align horizontally
icon: {
  alignItems: 'center', // Center items horizontally
  justifyContent: 'center',
  flexDirection: 'column', // Stack icon and text vertically
},
reviewContainer: {
  marginTop: 16,
  padding: 16,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
},
reviewLabel: {
  fontSize: 16,
  fontWeight: 'bold',
},
reviewInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  padding: 8,
  height: 80,
  marginBottom: 8,
},
ratingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
star: {
  fontSize: 24,
  color: '#ccc',
},
selectedStar: {
  fontSize: 24,
  color: '#FFD700', // Gold color for selected stars
},
submitReviewButton: {
  backgroundColor: '#800080',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
},
submitReviewText: {
  color: '#fff',
  fontSize: 16,
},


  reviewsContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  reviewsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: '#E6E6FA',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  defaultProfileIcon: {
    backgroundColor: '#ccc', // Placeholder color for users without profile pics
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  filesContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  musicPlayerContainer: {
    backgroundColor: '#eee', // Light background for the player
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  musicPlayerHeader: {
    marginBottom: 8,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  musicFileName: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  seekBarContainer: {
    flex: 1,
    marginLeft: 10,
  },
  seekBar: {
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  seekProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  coolFont: {
  },
  seekProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
loadingIndicator: {
  marginLeft: 10,
},

  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222', // Slightly darker for emphasis
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9966CC', // Secondary accent color for Type
    backgroundColor: '#C8A2D3',
    fontFamily: 'Poppins_400Regular',
    borderRadius: 8,
  },



    tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#E0E0E0', // Light gray for neutral background, adjust as needed
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#333', // Dark text color for readability
    fontFamily: 'Poppins_400Regular', // Use your Poppins font here
    fontSize: 14,
  },

  smallDetailText: {
    fontSize: 8,  // Smaller font size
    color: '#666', // Lighter color for secondary information
    marginVertical: 5,
  },


  descriptionContainer: {
    fontSize: 14, // Slightly smaller to make it secondary
    color: '#555', // Softer, more neutral color for less emphasis
    paddingVertical: 4, // Slightly reduced vertical padding
    paddingHorizontal: 10, // Slightly reduced horizontal padding
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8E4585', // Lighter accent color for secondary category
    backgroundColor: '#C8A2D3', // Light pastel background to make it secondary but visible
    fontFamily: 'Poppins_400Regular',
    borderRadius: 8,
  },

  // Adjusted text style for the description to fit the container
  descriptionText: {
    color: '#555', // Softer, more neutral color for less emphasis
    fontSize: 14,               // Smaller font size for description text
    lineHeight: 20,             // Line height for better spacing between lines
    fontFamily: 'Poppins_400Regular', // Use your Poppins font here
  },

  categoryContainer: {
    flexDirection: 'row', // This ensures the items are displayed horizontally
    paddingVertical: 4, // Slightly reduced vertical padding
    paddingHorizontal: 10, // Slightly reduced horizontal padding
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8E4585', // Lighter accent color for secondary category
    backgroundColor: '#C8A2D3', // Light pastel background to make it secondary but visible
    fontFamily: 'Poppins_400Regular',
    borderRadius: 8,
  },
  categoryText: {
    color: '#555', // Softer, more neutral color for less emphasis
    fontSize: 14,           // Font size for category text
    fontFamily: 'Poppins_400Regular',
    lineHeight: 26, // Set lineHeight equal to fontSize to remove excess space below
  },
  exclusiveText: {
    fontSize: 14,
    lineHeight: 24, // Better line spacing for readability
    fontFamily: 'Poppins_400Regular',
  },
  distinctLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  distinctLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff6347', // distinct color for the loading text
  },
  reviewsContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  noReviewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noReviewsText: {
    fontSize: 18,
    color: '#333',
  },
});


export default styles;