// Import required dependencies
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';


    // For banner-style image
export const handleImagePick = async (setImageUri) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Banner aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  // Multi-image picker for image showcase
export const handlePickImages = async (setImageUris, MAX_IMAGES) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

   if (!result.canceled && result.assets && result.assets.length > 0) {
    if (result.assets.length <= MAX_IMAGES) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImageUris(selectedImages);
    } else {
      Alert.alert(`You can only select up to ${MAX_IMAGES} images.`);
    }
  } else {
    console.log('Image picking was canceled or no images were selected.');
  }
  };
  
export const handleDocumentPick = async (setSelectedDocuments, selectedDocuments) => {
    // Limit the number of selected documents to 3
    if (selectedDocuments.length >= 3) {
      Alert.alert('You can only select up to 3 documents.');
      return;
    }

    try {
      // Use Expo's Document Picker to select a document
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/*', // Allow all document types
        multiple: false, // Only allow one document at a time
      });

      console.log('Document Picker Result:', result);

      // If the user cancels the picker, exit
      if (result.canceled) {
        console.log('Document picking was canceled.');
        return;
      }

      // Process the selected document
      const document = result.assets[0]; // Get the first asset (since multiple is false)

      // Check if the document exists on the file system
      const fileInfo = await FileSystem.getInfoAsync(document.uri);
      if (!fileInfo.exists) {
        Alert.alert('The selected file does not exist.');
        return;
      }

      // Add the document to the state
      setSelectedDocuments((prevDocuments) => [
        ...prevDocuments,
        {
          uri: document.uri,
          name: document.name,
          mimeType: document.mimeType,
          size: fileInfo.size, // Get file size info
        },
      ]);

    } catch (error) {
      // Catch and display any errors
      console.error('Error picking document:', error);
      Alert.alert('Error picking document. Please try again.');
    }
  };

export const handleFilePick = async (setSelectedFiles, selectedFiles) => {
  // Limit the number of selected files to 3
  if (selectedFiles.length >= 3) {
    Alert.alert('You can only select up to 3 files.');
    return;
  }

  try {
    // Use Expo's Document Picker to select a file
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // Allow all file types
      multiple: false, // Only allow one file at a time
    });

    console.log('Document Picker Result:', result);

    // If the user cancels the picker, exit
    if (result.canceled) {
      console.log('File picking was canceled.');
      return;
    }

    // Process the selected file
    const file = result.assets[0]; // Get the first asset (since multiple is false)

    // Check if the file exists on the file system
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    if (!fileInfo.exists) {
      Alert.alert('The selected file does not exist.');
      return;
    }

    // Extract file extension from the file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Determine the file type based on the extension
    let fileType = '';

    if (['pdf', 'doc', 'docx', 'txt', 'epub', 'mobi', 'odt'].includes(fileExtension)) {
      fileType = 'document'; // File type for documents
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'psd', 'ai', 'eps', 'tiff', 'tif', 'webp', 'bmp'].includes(fileExtension)) {
      fileType = 'image'; // File type for images
    } else if (['mp3', 'wav', 'aac', 'flac', 'm4a', ].includes(fileExtension)) {
      fileType = 'audio'; // File type for audio files
    } else if (['mp4', 'mov', 'avi', 'mkv', 'flv', 'avchd', 'webm'].includes(fileExtension)) {
      fileType = 'video'; // File type for video files
    } else if (['zip', 'rar', '7z', 'tar'].includes(fileExtension)) {
      fileType = 'archive'; // File type for compressed files
    } else if (['js', 'html', 'css', 'json', 'py', 'xml', 'htm'].includes(fileExtension)) {
      fileType = 'code'; // File type for code scripts
    } else if (['ttf', 'otf', 'woff', 'woff2'].includes(fileExtension)) {
      fileType = 'font'; // File type for font files
    } else if (['obj', 'fbx', 'stl', '3ds'].includes(fileExtension)) {
      fileType = '3dmodel'; // File type for 3D models
    } else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
      fileType = 'spreadsheet'; // File type for spreadsheet files
    } else if (['ppt', 'pptx', 'odp'].includes(fileExtension)) {
      fileType = 'presentation'; // File type for presentation files
    } else {
      fileType = 'others'; // Default type for unrecognized files
    }

    // Add the file to the state with its type
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
        size: fileInfo.size, // Get file size info
        fileType: fileType, // Store the determined file type
      },
    ]);

    // Optionally, upload the file to Firebase here, passing the fileType as metadata
    // You can use the `uploadFileToFirebase` function where the fileType is passed for upload

    console.log(`Selected file is of type: ${fileType}`);

  } catch (error) {
    // Catch and display any errors
    console.error('Error picking file:', error);
    Alert.alert('Error picking file. Please try again.');
  }
};


    // Function to handle music picking
export const handleMusicPick = async (setSelectedMusic, selectedMusic) => {
  // Limit the number of selected music files to 3
  if (selectedMusic.length >= 3) {
    Alert.alert('You can only select up to 3 music files.');
    return;
  }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*', // Allow only audio file types
      multiple: false, // Only allow one document at a time
    });

    if (result.canceled) {
      console.log('Music picking was canceled.');
      return;
    }

    const music = result.assets[0]; // Get the first asset

    // Check if the music file exists on the file system
    const fileInfo = await FileSystem.getInfoAsync(music.uri);
    if (!fileInfo.exists) {
      Alert.alert('The selected music file does not exist.');
      return;
    }

    // Check if the file size exceeds 10 MB (10 MB = 10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
    if (fileInfo.size > MAX_SIZE) {
    Alert.alert(
      'File Too Large',
      'The selected music file is too large. Please select a file smaller than 10 MB.',
      [{ text: 'OK' }]
    );
      return;
    }

    // Add the music file to the state if the size is within the limit
    setSelectedMusic((prevMusic) => [
      ...prevMusic,
      {
        uri: music.uri,
        name: music.name,
        mimeType: music.mimeType,
        size: fileInfo.size, // Get file size info
      },
    ]);
    
  } catch (error) {
    console.error('Error picking music file:', error);
    Alert.alert('Error picking music file. Please try again.');
  }
};

  // Function to handle video picking
export const handleVideoPick = async (setSelectedVideos, selectedVideos) => {
  // Limit the number of selected video files to 3
  if (selectedVideos.length >= 3) {
    Alert.alert('You can only select up to 3 video files.');
    return;
  }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*', // Allow only video file types
      multiple: false, // Only allow one document at a time
    });

    if (result.canceled) {
      console.log('Video picking was canceled.');
      return;
    }

    const video = result.assets[0]; // Get the first asset

    // Check if the video file exists on the file system
    const fileInfo = await FileSystem.getInfoAsync(video.uri);
    if (!fileInfo.exists) {
      Alert.alert('The selected video file does not exist.');
      return;
    }

    // Check if the file size exceeds 10 MB
    if (fileInfo.size > 10 * 1024 * 1024) { // 10 MB in bytes
      Alert.alert('File too large', 'Please select a video file smaller than 10 MB.');
      return; // Stop if file size exceeds limit
    }

    // Add the video file to the state if size is acceptable
    setSelectedVideos((prevVideos) => [
      ...prevVideos,
      {
        uri: video.uri,
        name: video.name,
        mimeType: video.mimeType,
        size: fileInfo.size, // Get file size info
      },
    ]);
  } catch (error) {
    console.error('Error picking video file:', error);
    Alert.alert('Error picking video file. Please try again.');
  }
};