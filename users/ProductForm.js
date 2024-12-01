import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text as RNText } from 'react-native';
import { Text, Card, Button, TextInput as PaperTextInput } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import {
  handlePickImages,
  handleDocumentPick,
  handleFilePick,
  handleVideoPick,
  handleMusicPick,
  removeDocument,
  removeFile,
  removeMusic,
  removeVideo,
} from '../seller-src/mediaPickers.js';

const ProductForm = ({
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
}) => {
  const [stock, setStock] = useState("");


  useEffect(() => {
    // Reset files and stock on category change
    setImageUris([]);
    setSelectedDocuments([]);
    setSelectedFiles([]);
    setSelectedVideos([]);
    setSelectedMusic([]);
    setStock("");
  }, [category]);

  const handleSaveStock = () => {
    if (stock) {
      alert(`Stock of ${stock} saved for this product/service.`);
    } else {
      alert("Please enter a stock quantity.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(300)}>
        <Card style={styles.card}>
          <Card.Title title="Product/Service Details" titleStyle={styles.cardTitle} />
          <Card.Content>
            {imageUri && (
              <>
                <Text style={styles.label}>Image:</Text>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </>
            )}
            
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{type}</Text>

            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name}</Text>

            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>${price}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{description}</Text>

            {/* Category Picker */}
            <Text style={styles.label}>Category:</Text>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Images" value="images" />
              <Picker.Item label="File" value="file" />
              <Picker.Item label="Video" value="video" />
              <Picker.Item label="Music" value="music" />
              <Picker.Item label="Others" value="others" />
            </Picker>

      {/* Conditional Uploaders based on Category */}
      {category === 'images' && (
        <>
          <Text style={styles.sectionTitle}>Upload Multiple Images</Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => handlePickImages(setImageUris, MAX_IMAGES)}>
            <Text style={styles.imageButtonText}>Pick Images (Max 5)</Text>
          </TouchableOpacity>

          <View style={styles.imagePreviewContainer}>
            {imageUris.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </View>
        </>
      )}

    {category === 'file' && (
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ marginTop: 10 }}>Upload a Document</Text>
        
        <TouchableOpacity 
          onPress={() => handleDocumentPick(setSelectedDocuments, setSelectedDocuments)} // Wrap in an anonymous function
          style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}>
          <Text>Pick a Document</Text>
        </TouchableOpacity>

        <ScrollView>
          {selectedDocuments.length > 0 ? (
            selectedDocuments.map((item, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                {item.name ? (
                  <>
                    <Text>Name: {item.name}</Text>
                    <Text>Size: {item.size ? `${item.size} bytes` : 'Size unavailable'}</Text>
                    <Button title="Remove" onPress={() => removeDocument(index, setSelectedDocuments)} />
                  </>
                ) : null}
              </View>
            ))
          ) : (
            <Text>No document selected</Text>
          )}
        </ScrollView>
      </View>
    )}

  {category === 'video' && (
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ marginTop: 10 }}>Upload a Video File</Text>
        
        <TouchableOpacity 
          onPress={() => handleVideoPick(setSelectedVideos, selectedVideos)}
          style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}>
          <Text>Pick a Video File</Text>
        </TouchableOpacity>

        <ScrollView>
          {selectedVideos.length > 0 ? (
            selectedVideos.map((item, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                {item.name ? (
                  <>
                    <Text>Name: {item.name}</Text>
                    <Text>Size: {item.size ? `${item.size} bytes` : 'Size unavailable'}</Text>
                    <Button title="Remove" onPress={() => removeVideo(index, setSelectedVideos)} />
                  </>
                ) : null}
              </View>
            ))
          ) : (
            <Text>No videos selected</Text>
          )}
        </ScrollView>
      </View>
    )}

    {category === 'music' && (
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ marginTop: 10 }}>Upload a Music File</Text>
        
        <TouchableOpacity 
          onPress={() => handleMusicPick(setSelectedMusic, selectedMusic)}
          style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}>
          <Text>Pick a Music File</Text>
        </TouchableOpacity>

        <ScrollView>
          {selectedMusic.length > 0 ? (
            selectedMusic.map((item, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                {item.name ? (
                  <>
                    <Text>Name: {item.name}</Text>
                    <Text>Size: {item.size ? `${item.size} bytes` : 'Size unavailable'}</Text>
                    <Button title="Remove" onPress={() => removeMusic(index, setSelectedMusic)} />
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
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ marginTop: 10 }}>Upload Any File</Text>
      
      <TouchableOpacity 
        onPress={() => handleFilePick(setSelectedFiles, setSelectedFiles)} // Wrap in an anonymous function
        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}>
        <Text>Pick a File</Text>
      </TouchableOpacity>

      <ScrollView>
        {selectedFiles.length > 0 ? (
          selectedFiles.map((item, index) => (
            <View key={index} style={{ marginTop: 10 }}>
              {item.name ? (
                <>
                  <Text>Name: {item.name}</Text>
                  <Text>Size: {item.size ? `${item.size} bytes` : 'Size unavailable'}</Text>
                  <Button title="Remove" onPress={() => removeFile(index,setSelectedFiles)} />
                </>
              ) : null}
            </View>
          ))
        ) : (
          <Text>No file selected</Text>
        )}
      </ScrollView>
    </View>
  )}


            {/* Stock Input */}
            <Text style={styles.label}>Stock Quantity:</Text>
            <PaperTextInput
              style={styles.textInput}
              placeholder="Enter stock quantity"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#C8A2D3"
              activeOutlineColor="#A77BCA"
              theme={{ colors: { primary: '#A77BCA', placeholder: '#888' } }}
            />

            <Button mode="contained" onPress={handleSaveStock} style={styles.saveButton}>
              Save Stock
            </Button>
                  {/* Save Product/Service */}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
          <Text style={styles.saveButtonText}>Save Product/Service</Text>
        </TouchableOpacity>
      )}
          </Card.Content>
        </Card>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
    opacity: 0.85,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#F7F7F7',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 5,
  },
  imageButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  imagePreview: {
    width: '48%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  uploadButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});


export default ProductForm;
