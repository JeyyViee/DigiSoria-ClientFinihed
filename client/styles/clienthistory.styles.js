import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  backButtonText: {
    marginLeft: 5,
    color: '#555',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#E6E6FA',
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#9966CC",
    borderRadius: 8,
    minWidth: 85,
  },
  sortText: {
    marginLeft: 5,
    color: "#E6E6FA",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#E6E6FA",
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
  flex: 1,
  borderRadius: 8,
  marginHorizontal: 5,
  overflow: 'hidden', // To ensure rounded corners for gradient
  justifyContent: 'center', // Aligns children vertically
  alignItems: 'center', // Centers children horizontally
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    lineHeight: 20, // Adjust this value based on your button height to center vertically
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
    backgroundColor: '#9966CC', // Change the background color as needed
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
    color: '#FFF',
  },


  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333',
    elevation: 2, // Add shadow effect for elevation on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
 modalContainer: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 15,
    width: '80%',
    maxWidth: 400, // Max width for large screens
    alignItems: 'center',
    elevation: 5, // Add shadow effect to modal container
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A4A4A', // Title color for better contrast
  },
  closeButton: {
    backgroundColor: "#FF4C4C", // Red color for close
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3, // Slight elevation for button hover effect
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalBody: {
    width: '100%',
    marginTop: 15,
  },
  submitButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

});

export default styles;