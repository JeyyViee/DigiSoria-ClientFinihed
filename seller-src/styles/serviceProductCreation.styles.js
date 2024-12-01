import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'transparent', // Fully transparent background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082', // Dark violet color for the title
    textAlign: 'center', // Center the title text horizontally
    alignSelf: 'center', // Center the text block in the container
    marginVertical: 10, // Optional: adds space above and below
    fontFamily: 'CHICKEN Pie',
  },
  noProductsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  cardContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 15,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347', // Accent color for price
    marginBottom: 10,
  },
  creationDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#FF6347',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Optional overlay to improve readability
  },
  backgroundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B0082', // or another complementary color
  },
  sortWrapper: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 20, // Rounded corners
    backgroundColor: '#9966CC', // Light lavender color
    shadowColor: '#000', // Optional: shadow for elevation effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow effect
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
eyeButton: {
  marginRight: 10,
  padding: 5,
  justifyContent: 'center',
  alignItems: 'center',
},
badge: {
  position: 'absolute',
  top: -5,
  right: -5,
  backgroundColor: 'red',
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
badgeText: {
  color: 'white',
  fontSize: 12,
  fontWeight: 'bold',
},

});

export default styles;
