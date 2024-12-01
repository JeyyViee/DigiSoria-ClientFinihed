import { Audio } from 'expo-av';

// Remove selected music file
export const removeMusic = (index, setSelectedMusic) => {
  setSelectedMusic((prevMusicFiles) =>
    prevMusicFiles.filter((_, i) => i !== index)
  );
};

// Remove selected document file
export const removeDocument = (index, setSelectedDocuments) => {
  setSelectedDocuments((prevDocuments) =>
    prevDocuments.filter((_, i) => i !== index)
  );
};

// Remove selected video file
export const removeVideo = (index, setSelectedVideos) => {
  setSelectedVideos((prevVideos) =>
    prevVideos.filter((_, i) => i !== index)
  );
};

// Remove selected file
export const removeFile = (index, setSelectedFiles) => {
  setSelectedFiles((prevFiles) => 
    prevFiles.filter((_, i) => i !== index));
};

// Play sound and return cleanup function
export const playSound = async (uri, setSound) => {
  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true, isLooping: true } // Autoplay and loop
  );
  setSound(sound);

  // Return cleanup function to unload the sound when necessary
  return () => {
    sound.unloadAsync(); 
  };
};


// Your function definitions
export const showAllPreviews = (setPreviewVisible, setPreviewCategory) => {
  setPreviewVisible(true); // Show the preview modal
  setPreviewCategory('all'); // You can also use a custom category if needed
};

  export const clearAllFiles = async (
    sound,
    setSound,
    setSelectedFiles,
    setSelectedVideos,
    setSelectedMusic,
    setSelectedDocuments,
    setImageUris
  ) => {
    // Stop and unload sound if it is playing
    if (sound) {
      await sound.stopAsync(); // Stop playback
      await sound.unloadAsync(); // Unload the sound
      setSound(null); // Clear the sound instance
    }

    // Clear all selected files
    setSelectedFiles([]);
    setSelectedVideos([]);
    setSelectedMusic([]);
    setSelectedDocuments([]);
    setImageUris([]);
  };

