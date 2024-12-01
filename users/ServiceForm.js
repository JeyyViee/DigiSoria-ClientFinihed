import React from 'react';
import { Text, View } from 'react-native';

const ServiceForm = ({ route }) => {
  const { name, price, description, imageUri } = route.params; // Access passed data

  return (
    <View>
      <Text>Product Name: {name}</Text>
      <Text>Price: {price}</Text>
      <Text>Description: {description}</Text>
      {/* Add other product-specific inputs here */}
    </View>
  );
};

export default ServiceForm;
