import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { Alert } from 'react-native';
import { firebase } from '../firebase/firebaseUserConfig';


// Upload both single banner image and multiple showcase images
export const uploadImagesToStorage = async (imageUris, setUploading) => {
    const storage = getStorage();
    setUploading(true);
    const uploadedUrls = [];

    for (let i = 0; i < imageUris.length; i++) {
      try {
        const response = await fetch(imageUris[i]);
        const blob = await response.blob();

        const imageRef = ref(storage, `products_services/multiple/${Date.now()}_image${i}.jpg`);
        const uploadResult = await uploadBytes(imageRef, blob);

        const downloadUrl = await getDownloadURL(uploadResult.ref);
        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedUrls;
  };

export const uploadBannerImageToStorage = async (imageUri, setImageUploading, user) => {
    if (!imageUri) return null;

    try {
      setImageUploading(true);
      const storage = getStorage(); // Ensure storage is initialized correctly
      const imageRef = ref(storage, `services_products/${Date.now()}_${user.uid}.jpg`);
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload image
      const uploadResult = await uploadBytes(imageRef, blob);

      // Get download URL after upload
      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
    }
  };

export const uploadFilesToFirebase = async (selectedFiles) => { 
  try {
    const uploadPromises = selectedFiles.map(async (file) => {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Ensure file-specific fileType is used
      const fileType = file.fileType || 'others';

      const storageRef = firebase.storage().ref().child(`files/${Date.now()}_${file.name}`);
      
      // Metadata with specific fileType for each file
      const metadata = { customMetadata: { fileType } };

      await storageRef.put(blob, metadata);
      const url = await storageRef.getDownloadURL();
      console.log(`Uploaded ${file.name} successfully with type ${fileType}.`);
      return { url, fileType }; // Use the specific fileType here
    });

    const fileUrls = await Promise.all(uploadPromises);
    return fileUrls;
  } catch (error) {
    console.error('Error uploading files:', error);
    Alert.alert('Error uploading files. Please try again.');
    return [];
  }
};

export const uploadDocumentsToFirebase = async (selectedDocuments) => {
    try {
      const uploadPromises = selectedDocuments.map(async (doc) => {
        const response = await fetch(doc.uri);
        const blob = await response.blob();

        // Assuming you're uploading to Firebase Storage
        const storageRef = firebase.storage().ref().child(`documents/${Date.now()}_${doc.name}`);
        await storageRef.put(blob);

        // Get the download URL after the upload
        const url = await storageRef.getDownloadURL();
        console.log(`Uploaded ${doc.name} successfully.`);
        return url; // Return the URL of the uploaded document
      });

      const documentUrls = await Promise.all(uploadPromises);
      return documentUrls; // Return the array of document URLs
    } catch (error) {
      console.error('Error uploading documents:', error);
      Alert.alert('Error uploading documents. Please try again.');
      return []; // Return an empty array in case of an error
    }
  };

// Function to upload music files to Firebase
export const uploadMusicToFirebase = async (selectedMusic) => {
    try {
      // Create an array of promises for each selected music file
      const uploadPromises = selectedMusic.map(async (selectedMusic) => {
        console.log('Starting upload for:', selectedMusic.name);

        // Fetch the music file as a blob
        const response = await fetch(selectedMusic.uri);
        if (!response.ok) {
          console.error('Failed to fetch music file:', selectedMusic.name, response);
          throw new Error('Failed to fetch music file');
        }
        
        const blob = await response.blob();
        console.log('Blob created for:', selectedMusic.name);

        // Create a unique storage path for the music file in Firebase
        const storageRef = firebase.storage().ref().child(`music/${Date.now()}_${selectedMusic.name}`);

        // Upload the music file to Firebase Storage
        const uploadTask = await storageRef.put(blob);
        console.log('Upload finished for:', selectedMusic.name);

        // Get the download URL
        const musicUrl = await uploadTask.ref.getDownloadURL();
        console.log('Music URL retrieved for:', selectedMusic.name, musicUrl);

        // Return the URL of the uploaded music file
        return musicUrl;
      });

      // Wait for all uploads to complete and gather the URLs
      const musicUrls = await Promise.all(uploadPromises);
      return musicUrls; // Return the array of music URLs
    } catch (error) {
      console.error('Error uploading music:', error);
      Alert.alert('Error uploading music. Please try again.'); // Alert on error
      return []; // Return an empty array in case of failure
    }
  };

// Function to upload video files to Firebase
export const uploadVideoToFirebase = async (selectedVideos) => {
    try {
      // Create an array of promises for each selected video file
      const uploadPromises = selectedVideos.map(async (selectedVideo) => {
        console.log('Starting upload for:', selectedVideo.name);

        // Fetch the video file as a blob
        const response = await fetch(selectedVideo.uri);
        const blob = await response.blob();
        console.log('Blob created for:', selectedVideo.name);

        // Create a unique storage path for the video file in Firebase
        const storageRef = firebase.storage().ref().child(`videos/${Date.now()}_${selectedVideo.name}`);

        // Upload the video file to Firebase Storage
        const uploadTask = await storageRef.put(blob);
        console.log('Upload finished for:', selectedVideo.name);

        // Get the download URL
        const videoUrl = await uploadTask.ref.getDownloadURL();
        console.log('Video URL retrieved for:', selectedVideo.name, videoUrl);

        // Return the URL of the uploaded video file
        return videoUrl;
      });

      // Wait for all uploads to complete and gather the URLs
      const videoUrls = await Promise.all(uploadPromises);
      return videoUrls; // Return the array of video URLs
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error uploading video. Please try again.'); // Alert on error
      return []; // Return an empty array in case of failure
    }
  };
