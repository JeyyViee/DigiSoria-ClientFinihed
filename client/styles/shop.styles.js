import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 8,
  },
  titleContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#8e44ad',
  },
  activeCategoryText: {
    color: 'white',
  },
  inactiveCategoryText: {
    color: '#6c5ce7',
  },
  sortPicker: {
    height: 40,
    marginBottom: 20,
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 8, // Add margin to create space between items
    borderRadius: 10,
    shadowColor: '#6c5ce7',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    paddingBottom: 10, // Reduce padding
  },
  productImage: {
    width: '100%',
    height: 100, // Reduced height for a compact layout
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productName: {
    fontSize: 16, // Reduced font size for compact display
    color: '#8e44ad',
  },
  productPrice: {
    fontSize: 14, // Reduced font size for compact display
    color: '#6c5ce7',
    marginTop: 5,
  },
  productSeller: {
    fontSize: 12,
    color: '#9b59b6',
    marginTop: 5,
  },
  buyButton: {
    marginTop: 6,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  productListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows items to wrap onto new lines
    justifyContent: 'space-between',
    padding: 10,
  },
  productCard: {
    width: width / 2 - 20, // Half of the screen width, minus padding
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 10,
    color: '#666',
  },
  buyButton: {
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 4,
  },
recommendedSectionContainer: {
  paddingVertical: 15,
  marginBottom: 20,
},
subtitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginLeft: 10,
  marginBottom: 10,
},
horizontalFlatList: {
  paddingHorizontal: 10,
},
recommendedCardHorizontal: {
  width: 250,
  backgroundColor: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
  marginRight: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
recommendedImageHorizontal: {
  width: '100%',
  height: 150,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
},
recommendedInfoHorizontal: {
  padding: 10,
},
recommendedProductText: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 5,
},
recommendedProductPrice: {
  fontSize: 14,
  color: '#6200EE',
  marginBottom: 5,
},
recommendedProductSeller: {
  fontSize: 12,
  color: '#757575',
  marginBottom: 5,
},
recommendedProductDate: {
  fontSize: 12,
  color: '#757575',
},
  searchBar: {
    marginHorizontal: 20, // Adjust horizontal margin as needed
    marginVertical: 10,   // Adjust vertical margin for spacing from other elements
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1, // Border width for outline
    fontSize: 16,
    backgroundColor: '#fff', // Background color for the search bar
  },
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},

});

export default styles;
