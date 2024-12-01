import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TypeSelectionModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide" // Slide animation for a smooth entrance
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose Product or Service</Text>
          
          {/* Product Button */}
          <TouchableOpacity
            onPress={() => onSelect('product')}
            style={[styles.button, styles.productButton]}
          >
            <MaterialIcons name="shopping-cart" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Product</Text>
          </TouchableOpacity>

          {/* Service Button */}
          <TouchableOpacity
            onPress={() => onSelect('service')}
            style={[styles.button, styles.serviceButton]}
          >
            <FontAwesome5 name="hands-helping" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Service</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <MaterialIcons name="cancel" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly dark overlay for emphasis
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Shadow effect for Android
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  productButton: {
    backgroundColor: '#A77BCA', // Lavender-inspired color for product button
    borderColor: '#9B59B6', // Amethyst for border
    borderWidth: 1,
  },
  serviceButton: {
    backgroundColor: '#C8A2D3', // Lighter lavender for service button
    borderColor: '#A77BCA', // Deeper lavender for border
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#D3D3D3', // Light gray for cancel button
    borderColor: '#A77BCA', // Complementary lavender for border
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TypeSelectionModal;
