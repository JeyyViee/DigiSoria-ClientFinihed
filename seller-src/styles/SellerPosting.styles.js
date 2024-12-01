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
  productListContainer: {
    flex: 1,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    marginHorizontal: 5, // Spacing between each card
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '48%', // Adjusts each card width to take up half the row width with spacing
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productSeller: {
    fontSize: 12,
    marginBottom: 8,
  },
  buyButton: {
    marginTop: 10,
    marginTop: 'auto',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 6,  // Add shadow for the button to float above content
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
});

export default styles;
