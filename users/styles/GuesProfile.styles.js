// ProfileGuest.styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensure the background covers the entire screen
  },
  container: {
    flex: 1,
  },
  productsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  scrollContent: {
    padding: 20,
  },
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,  // Take up remaining space
    height: 40,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'left',
  },
  horizontalFlatList: {
    paddingVertical: 10,
    flexDirection: 'row', // Align items side by side
    flexWrap: 'wrap', // Wrap items to the next line if they overflow
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 160,
  },
cardAbove: {
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 250, // Set to a larger width
    height: 220,
    margin: 10, // Add margin around each card for better spacing
},
  userInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  userRole: {
    fontSize: 12,
    color: '#777',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  productCard: {
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 220, // Wider width for longer text
    marginBottom: 10,
    width: '48%', // Set width to allow two items side by side
  },
  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  productText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  priceText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    fontWeight: 'bold'
  },
  productsContainerBelow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping of items
    justifyContent: 'space-between', // Create space between items
    paddingVertical: 10,
    marginBottom: 0,
  },
  productCardBelow: {
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '45%', // Set width to allow two items side by side
    marginBottom: 20, // Add margin at the bottom for spacing
  },

    featuredProductText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  featuredProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 4,
  },
  featuredProductSeller: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  featuredProductDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default styles;
