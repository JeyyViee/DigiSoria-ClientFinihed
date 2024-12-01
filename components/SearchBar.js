// SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={onSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: '#9966CC', // Light lavender for the background
    borderRadius: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#9C27B0', // Darker purple for the border
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#EDE7F6', // Light violet for input background
    color: '#4B0082', // Dark violet text color
  },
});

export default SearchBar;
