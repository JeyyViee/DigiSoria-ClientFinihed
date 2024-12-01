import { View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView, Button, ImageBackground, Modal, FlatList } from 'react-native';
import { handlePickImages, handleDocumentPick, handleFilePick, handleVideoPick, handleMusicPick } from '../mediaPickers';
import { removeMusic, removeDocument, removeVideo, removeFile } from '../constants';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Text, IconButton, useTheme, TextInput as PaperTextInput, Card, Menu, Button as PaperButton, HelperText } from 'react-native-paper';
import { handleImagePick } from '../mediaPickers';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import CreationLoadingScreen from '../CreationLoadingScreen';


const ProductServiceForm = ({
  name, setName,
  price, setPrice,
  type, setType,
  description, setDescription,
  terms, setTerms,
  category, setCategory,
  imageUri, setImageUri,
  imageUris, setImageUris,
  selectedDocuments, setSelectedDocuments, 
  selectedFiles, setSelectedFiles,
  selectedVideos, setSelectedVideos,
  selectedMusic, setSelectedMusic,
  handleAddProduct,
  styles, MAX_IMAGES, uploading,
  pricingAndLicensing, setPricingAndLicensing,
  tags, setTags,
  termsOfUse, setTermsOfUse,
  stock, setStock,
  rate, setRate,
  deliveryTime, setDeliveryTime,
}) => {

  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [deliveryTimeModalVisible, setDeliveryTimeModalVisible] = useState(false);
  const [fileType, setFileType] = useState('');

  const rateOptions = ["Hourly", "Weekly", "Monthly", "Yearly"];

  const categories = [
    { label: "Select Category", value: "" },
    { label: "Images", value: "images" },
    { label: "Document", value: "file" },
    { label: "Video", value: "video" },
    { label: "Music", value: "music" },
    { label: "Others", value: "others" }
  ];

  const deliveryOptions = [
    { label: 'Immediate', value: 'Immediate' },
    { label: '1 Day', value: '1 Day' },
    { label: '3 Days', value: '3 Days' },
    { label: '1 Week', value: '1 Week' },
    { label: '2 Weeks', value: '2 Weeks' },
  ];

  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1048576) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / 1048576).toFixed(2)} MB`;
    }
  };

  const filteredCategories = categories.filter(item => item.value !== "");
  const handleRemoveImage = (uri) => {
    setImageUris(imageUris.filter((imageUri) => imageUri !== uri));
  };

  const handleCategorySelect = (value) => {
    setCategory(value);
    setModalVisible(false); // Close modal after selecting
  };


const handleAddTag = () => {
  // Check if the tagInput is not empty and meets the conditions
  if (tagInput.trim() === '') {
    setTagError(true); // Show error if the input is blank
    return; // Don't proceed if it's blank
  }

  // Proceed with the existing conditions
  if (tagInput.length <= 15 && !tags.includes(tagInput) && tags.length < 5) {
    setTags([...tags, tagInput]); // Add the tag
    setTagInput(''); // Clear the input after adding the tag
    setTagError(false); // Reset error
  } else if (tags.length >= 5) {
    alert('You can only add a maximum of 5 tags.'); // Show alert if more than 5 tags
  } else {
    setTagError(true); // Show error if input exceeds 15 characters or is a duplicate
  }
};

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
  };

  // Reset file arrays on category change
  useEffect(() => {
    setImageUris([]);
    setSelectedDocuments([]);
    setSelectedFiles([]);
    setSelectedVideos([]);
    setSelectedMusic([]);
  }, [category]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colors } = useTheme();
  const maxLength = 15;
  const maxLengthDesc = 2000;
  const maxLengthTerms = 2000;
  const maxLengthLicense = 100;

  
  if (!fontsLoaded) {
    return null; // or <AppLoading /> if you have it installed for a loading screen
  }

return (
    <ImageBackground
      source={require('../../assets/background.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <Card style={[styles.container, { borderWidth: 1, borderColor: '#ddd' }]}>
        <Text style={[styles.title, { fontFamily: 'Poppins_700Bold', fontSize: 24, color: colors.primary }]}>
          Add New Product/Service
        </Text>

    <TouchableOpacity onPress={() => handleImagePick(setImageUri)} style={styles.bannerContainer}>
      {imageUri ? (
        // If an image is selected, display it with an overlay
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.bannerImage} />
          <View style={styles.imageOverlay} />
        </View>
      ) : (
        // Display placeholder icon and text if no image is selected
        <View style={styles.placeholderContainer}>
          <IconButton icon="camera" size={40} color={colors.primary} />
          <Text style={styles.placeholderText}>Add Image Banner</Text>
        </View>
      )}
    </TouchableOpacity>

      <PaperTextInput
        style={styles.textInputStyle}
        placeholder="Product/Service Name (max 15 chars)"
        placeholderTextColor="#888"
        value={name}
        onChangeText={(text) => {
          if (text.length <= maxLength) setName(text);
        }}
        mode="outlined"
        outlineColor="#C8A2D3"
        activeOutlineColor="#A77BCA"
        theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
      />
      <Text
        style={[
          styles.charCounter,
          { color: name.length === maxLength ? 'red' : colors.text },
        ]}
      >
        {name.length} / {maxLength}
      </Text>

      <PaperTextInput
        style={[styles.textInputStyle, { height: 40 }]} // Using textInputStyle with height for compactness
        placeholder="Price (in dollars)"
        placeholderTextColor="#888" // Adjust to colors.placeholder if using a theme
        value={price}
        keyboardType="numeric"
        onChangeText={(text) => {
          // Allow only numbers and up to two decimal places
          const numericValue = text.replace(/[^0-9.]/g, '');
          const parts = numericValue.split('.');
          if (parts.length > 2) {
            return;
          }
          if (parts.length === 2 && parts[1].length > 2) {
            return;
          }
          setPrice(numericValue);
        }}
        mode="outlined"
        outlineColor="#C8A2D3" // Adjust to colors.primary if using a theme
        activeOutlineColor="#A77BCA" // Adjust to colors.accent if using a theme
      />

    <PaperTextInput
      style={styles.descriptionInput}
      placeholder="Description (max 2000 characters)"
      placeholderTextColor="#888"
      value={description}
      onChangeText={(text) => {
        if (text.length <= maxLengthDesc) setDescription(text);
      }}
      maxLength={maxLengthDesc}
      multiline
      mode="outlined"
      outlineColor="#C8A2D3"
      activeOutlineColor="#A77BCA"
      contentStyle={{ paddingHorizontal: 8 }} // Reduce left and right padding
      theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
    />
    <Text
      style={[
        styles.charCounter,
        { color: description.length === maxLengthDesc ? 'red' : colors.text },
      ]}
    >
      {description.length} / {maxLengthDesc}
    </Text>

    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          type === 'product' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => setType('product')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            type === 'product' ? styles.activeText : styles.inactiveText,
          ]}
        >
          Product
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          type === 'service' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => setType('service')}
      >
        <Text
          style={[
            styles.toggleButtonText,
            type === 'service' ? styles.activeText : styles.inactiveText,
          ]}
        >
          Service
        </Text>
      </TouchableOpacity>
    </View>

    {type === 'product' && (
      <>
      {/* Licensing Input */}
      <PaperTextInput
        style={styles.descriptionInput}  // Reusing the same style for consistency
        placeholder="License Type (e.g., Personal, Commercial)"
        placeholderTextColor="#888"
        value={pricingAndLicensing}
        onChangeText={(text) => {
          if (text.length <= maxLengthLicense) setPricingAndLicensing(text);
        }}
        maxLength={maxLengthLicense}
        mode="outlined"
        outlineColor="#C8A2D3"
        activeOutlineColor="#A77BCA"
        contentStyle={{
          paddingHorizontal: 8,
          paddingVertical: 0,
          textAlignVertical: 'top', // Ensures content starts at the top
        }}
        theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
      />
      <Text
        style={[
          styles.charCounter,
          { color: pricingAndLicensing.length === maxLengthLicense ? 'red' : colors.text },
        ]}
      >
        {pricingAndLicensing.length} / {maxLengthLicense}
      </Text>
              
    <TextInput
      style={[styles.tagInput, tagError && styles.inputError]}
      placeholder="Add tags/keywords (max 15 chars)"
      placeholderTextColor="#A9A9A9" // Light gray for placeholder text
      value={tagInput}
      onChangeText={setTagInput}
      onSubmitEditing={handleAddTag}
    />
    {tagError && <Text style={styles.errorText}>Tag must be less than 15 characters!</Text>}

    <TouchableOpacity
      onPress={handleAddTag}
      style={[styles.addButton, tags.length >= 5 && styles.addButtonDisabled]}
      disabled={tags.length >= 5} // Disable the button if there are 5 tags
    >
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>

    <ScrollView horizontal style={styles.tagContainer}>
      {Array.isArray(tags) && tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
          <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.removeTagButton}>
            <Text style={styles.removeTagText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

    <PaperTextInput
      style={[styles.descriptionInput, { marginTop: 10 }]}
      placeholder="Terms of Use (max 2000 characters)"
      placeholderTextColor="#888"
      value={termsOfUse}
      onChangeText={(text) => {
        if (text.length <= maxLengthTerms) setTermsOfUse(text);
      }}
      maxLength={maxLengthTerms}
      multiline
      mode="outlined"
      outlineColor="#C8A2D3"
      activeOutlineColor="#A77BCA"
      contentStyle={{ paddingHorizontal: 8 }} // Reduce left and right padding
      theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
    />
    <Text
      style={[
        styles.charCounter,
        { color: termsOfUse.length === maxLengthTerms ? 'red' : colors.text },
      ]}
    >
      {termsOfUse.length}/{maxLengthTerms}
    </Text>

      <PaperTextInput
        style={[styles.textInputStyle, { height: 40 }]} // Using textInputStyle with height for compactness
        placeholder="Stock or Availability"
        placeholderTextColor="#888" // Adjust to colors.placeholder if using a theme
        value={stock}
        keyboardType="numeric"
        onChangeText={(text) => {
          // Allow only integers (no decimals or other characters)
          const numericValue = text.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
          setStock(numericValue ? parseInt(numericValue, 10) : ''); // Convert to number or empty string if no valid input
        }}
        mode="outlined"
        outlineColor="#C8A2D3" // Adjust to colors.primary if using a theme
        activeOutlineColor="#A77BCA" // Adjust to colors.accent if using a theme
      />
      </>
    )}

  {type === 'service' && (
    <>
      <Text style={styles.label}>Select Rate</Text>
      {rateOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioOption}
          onPress={() => setSelectedRate(option)}
        >
          <View style={styles.radioButton}>
            {selectedRate === option && <View style={styles.radioButtonSelected} />}
          </View>
          <Text style={styles.radioText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        onPress={() => setDeliveryTimeModalVisible(true)} 
        style={[styles.input, styles.deliveryTimeButton]}
      >
        <Text style={styles.deliveryTimeText}>
          {deliveryTime || "Select Delivery Time"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={deliveryTimeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeliveryTimeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={deliveryOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setDeliveryTime(item.value);
                    setDeliveryTimeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <TextInput
        style={[styles.tagInput, tagError && styles.inputError]}
        placeholder="Add tags/keywords (max 15 chars)"
        placeholderTextColor="#A9A9A9" // Light gray for placeholder text
        value={tagInput}
        onChangeText={setTagInput}
        onSubmitEditing={handleAddTag}
      />
      {tagError && <Text style={styles.errorText}>Tag must be less than 15 characters!</Text>}

      <TouchableOpacity
        onPress={handleAddTag}
        style={[styles.addButton, tags.length >= 5 && styles.addButtonDisabled]}
        disabled={tags.length >= 5} // Disable the button if there are 5 tags
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.tagContainer}>
        {Array.isArray(tags) && tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.removeTagButton}>
              <Text style={styles.removeTagText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <PaperTextInput
        style={[styles.descriptionInput, { marginTop: 10 }]}
        placeholder="Terms of Service (max 2000 characters)"
        placeholderTextColor="#888"
        value={terms}
        onChangeText={(text) => {
          if (text.length <= maxLengthTerms) setTerms(text);
        }}
        maxLength={maxLengthTerms}
        multiline
        mode="outlined"
        outlineColor="#C8A2D3"
        activeOutlineColor="#A77BCA"
        contentStyle={{ paddingHorizontal: 8 }}
        theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
      />
      <Text
        style={[
          styles.charCounter,
          { color: terms.length === maxLengthTerms ? 'red' : '#333' },
        ]}
      >
        {terms.length}/{maxLengthTerms}
      </Text>
    </>
  )}

      {/* Custom Touchable for Picker */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>
          {category ? categories.find(item => item.value === category)?.label : 'Select Category'}
        </Text>
      </TouchableOpacity>

     {/* Modal with list of categories */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item.value)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Conditional Uploaders based on Category */}
      {category === 'images' && (
        <>
          <Text style={styles.sectionTitle}>Upload Multiple Images</Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => handlePickImages(setImageUris, MAX_IMAGES)}>
            <Text style={styles.imageButtonText}>Pick Images (Max 5)</Text>
          </TouchableOpacity>

          {/* Image Preview Section */}
          <View style={styles.imagePreviewContainer}>
            {imageUris.map((uri, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(uri)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}

      {category === 'file' && (
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Upload a Document File</Text>
          
          <TouchableOpacity 
            onPress={() => {
              if (selectedDocuments.length < 3) {
                handleDocumentPick(setSelectedDocuments, setSelectedDocuments);
              } else {
                alert("You can only upload a maximum of three documents.");
              }
            }}
            style={styles.pickDocumentButton}>
            <Text style={styles.pickDocumentText}>Pick a Document</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {selectedDocuments.length > 0 ? (
              selectedDocuments.map((item, index) => (
                <View key={index} style={styles.documentItem}>
                  {item.name ? (
                    <>
                      <Text style={styles.documentName}>Name: {item.name}</Text>
                      <Text style={styles.documentSize}>
                        Size: {item.size ? `${(item.size / 1048576).toFixed(2)} MB` : 'Size unavailable'}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeDocument(index, setSelectedDocuments)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={styles.noDocumentsText}>No document selected</Text>
            )}
          </ScrollView>
        </View>
      )}

    {category === 'video' && (
      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Upload a Video File</Text>

        {selectedVideos.length === 0 && (
          <TouchableOpacity 
            onPress={() => handleVideoPick(setSelectedVideos, selectedVideos)}
            style={styles.pickButton}
          >
            <Text style={styles.buttonText}>Pick a Video File</Text>
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedVideos.length > 0 ? (
            selectedVideos.map((item, index) => (
              <View key={index} style={styles.videoItem}>
                {item.name && (
                  <>
                    <Text style={styles.videoName}>Name: {item.name}</Text>
                    <Text style={styles.videoSize}>
                      Size: {item.size ? formatFileSize(item.size) : 'Size unavailable'}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => removeVideo(index, setSelectedVideos)} 
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noVideosText}>No videos selected</Text>
          )}
        </ScrollView>
      </View>
    )}

    {category === 'music' && (
      <View style={{ flex: 1, padding: 15 }}>
        {/* Header Text */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Upload a Music File</Text>

          {/* Music File Picker Button */}
          <TouchableOpacity
            onPress={() => handleMusicPick(setSelectedMusic, selectedMusic)}
            style={{
              backgroundColor: '#A77BCA', 
              paddingVertical: 15, 
              borderRadius: 5,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>Pick a Music File</Text>
          </TouchableOpacity>

          {/* Selected Music Files */}
          <ScrollView>
            {selectedMusic.length > 0 ? (
              selectedMusic.map((item, index) => (
                <View key={index} style={{ marginTop: 15, backgroundColor: '#f4f4f4', borderRadius: 8, padding: 12 }}>
                  {item.name ? (
                    <>
                      {/* File Information */}
                      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Name: {item.name}</Text>
                      <Text style={{ marginBottom: 10 }}>
                        Size: {item.size ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : 'Size unavailable'}
                      </Text>
                      
                      {/* Remove Button */}
                      <TouchableOpacity
                        onPress={() => removeMusic(index, setSelectedMusic)}
                        style={{
                          backgroundColor: '#9966CC',
                          paddingVertical: 8,
                          borderRadius: 5,
                          alignItems: 'center',
                        }}>
                        <Text style={{ color: '#fff' }}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              ))
            ) : (
              <Text>No music selected</Text>
            )}
          </ScrollView>
        </View>
      )}

      {category === 'others' && ( // Changed from 'file' to 'others'
        <View style={{ flex: 1, padding: 20 }}>
          {/* Title for file upload */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Upload Any File
          </Text>

          
          {/* Pick a File Button */}
          <TouchableOpacity 
            onPress={() => handleFilePick(setSelectedFiles, selectedFiles)} // Wrap in an anonymous function
            style={{
              padding: 12,
              backgroundColor: '#A77BCA', // Color for the button
              borderRadius: 5,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Pick a File</Text>
          </TouchableOpacity>

          {/* Scrollable List of Selected Files */}
          <ScrollView style={{ flex: 1 }}>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: 15,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#f9f9f9',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  }}
                >
                  {item.name ? (
                    <>
                      {/* File Name and Size */}
                      <Text style={{ fontSize: 12 }}>
                        Name: {item.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Size: {item.size ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : 'Size unavailable'}
                      </Text>

                      {/* Remove Button */}
                      <TouchableOpacity
                        onPress={() => removeFile(index, setSelectedFiles)}
                        style={{
                          marginTop: 10,
                          backgroundColor: '#9966CC', // Red color for Remove button
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 16, color: '#888' }}>No file selected</Text>
            )}
          </ScrollView>
        </View>
      )}

    <TouchableOpacity
      style={[styles.saveButton, uploading && { opacity: 0.5 }]}
      onPress={handleAddProduct}
      disabled={uploading}
    >
      <Text style={styles.saveButtonText}>Save Product/Service</Text>
    </TouchableOpacity>
    </Card>
  </ScrollView>
</ImageBackground>
  );
};

export default ProductServiceForm;
