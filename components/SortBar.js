// SortBar.js
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SortBar = ({ sortOption, onSortChange }) => {
  return (
    <View style={styles.sortContainer}>
      <Picker
        selectedValue={sortOption}
        style={styles.sortPicker}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => onSortChange(itemValue)}
      >
        <Picker.Item label="Sort by Name" value="name" />
        <Picker.Item label="Sort by File Type" value="category" />
        <Picker.Item label="Sort by Price" value="price" />
        <Picker.Item label="Sort by Date" value="creationDate" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#F3E5F5', // Light lavender for background
    borderRadius: 12,
  },
  sortPicker: {
    height: 50,
    borderColor: '#9C27B0', // Dark purple for the border
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: Platform.OS === 'android' ? 'center' : 'flex-start', // Center on Android
  },
  pickerItem: {
    height: 50,
    color: '#4B0082', // Dark violet text color for items
    fontSize: 16,
  },
});

export default SortBar;
