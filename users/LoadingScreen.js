// LoadingScreen.js
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/gif/fire-emblem-maid-fire-emblem.gif')} // Update with your GIF path
          style={styles.loadingGif}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8ff', // Light background color
  },
  content: {
    alignItems: 'center', // Centers text and image together
  },
  loadingGif: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
  },
  text: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 18,
    color: 'purple',
  },
});

export default LoadingScreen;
