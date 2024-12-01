import React from "react";
import { View, TextInput, FlatList, TouchableOpacity, ImageBackground, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "../styles/clienthistory.styles";
import Header from "../../components/Header";
import backgroundImage from "../../assets/background.png";
import TransactionModal from "../TransactionModal";

const ClientHistoryUI = ({
  navigation,
  cartItems,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  refreshing,
  onRefresh,
  handleDelete,
  handleCompleteTransaction,
  modalVisible,
  setModalVisible,
  paymentRefId,
  setPaymentRefId,
  screenshot,
  setScreenshot,
  handleTransactionSubmit,
}) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Product Name: {item.name || "N/A"}</Text>
      <Text style={styles.itemText}>Date Added: {item.dateAdded || "N/A"}</Text>
      <Text style={styles.itemText}>Price: ${item.price ? (item.price / 100).toFixed(2) : "N/A"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleCompleteTransaction(item)}
          style={[styles.button, styles.completeButton]}
        >
          <Text style={styles.buttonText}>Complete Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Header />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() =>
              setSortOption((prev) =>
                prev === "Date" ? "Price" : prev === "Price" ? "A-Z" : "Date"
              )
            }
          >
            <Icon name="filter" size={20} />
            <Text style={styles.sortText}>{sortOption}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sortedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh} // Attach refresh function
          refreshing={refreshing} // Attach refreshing state
        />
      </View>
      <TransactionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        paymentRefId={paymentRefId}
        setPaymentRefId={setPaymentRefId}
        screenshot={screenshot}
        setScreenshot={setScreenshot}
        handleTransactionSubmit={handleTransactionSubmit}
      />
    </ImageBackground>
  );
};

export default ClientHistoryUI;
