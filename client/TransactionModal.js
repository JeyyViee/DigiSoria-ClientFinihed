import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../client/styles/clienthistory.styles";

const TransactionModal = ({
  modalVisible,
  setModalVisible,
  paymentRefId,
  setPaymentRefId,
  screenshot,
  setScreenshot,
  handleTransactionSubmit,
}) => {
  return (
    <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Complete Transaction</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Payment Reference ID"
            value={paymentRefId}
            onChangeText={setPaymentRefId} 
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Screenshot URL"
            value={screenshot}
            onChangeText={setScreenshot}
          />
          <TouchableOpacity onPress={handleTransactionSubmit} style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;
