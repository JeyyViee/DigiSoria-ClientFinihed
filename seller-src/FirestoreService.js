import { db, storage } from '../firebase/firebaseUserConfig';

// Fetch pending creations from the 'cart' collection
export const fetchPendingCreations = async () => {
  try {
    const snapshot = await db.collection('cart').get(); // Fetch all documents in the 'cart' collection
    return snapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Spread the rest of the document data
    }));
  } catch (error) {
    console.error('Error fetching pending creations:', error);
    throw error; // Rethrow error for caller to handle
  }
};

// Update the status of a specific cart item
export const updateStatus = async (creationId, status, files = []) => {
  try {
    const docRef = db.collection('cart').doc(creationId); // Reference to the specific document
    await docRef.update({
      status, // Update the status field
      files, // Attach file data (e.g., URLs)
      updatedAt: new Date().toISOString(), // Set the last updated timestamp
    });
    console.log(`Status updated successfully for creationId: ${creationId}`);
  } catch (error) {
    console.error('Error updating cart status:', error);
    throw error;
  }
};

// Save file metadata for a creation in the 'files' sub-collection
export const saveFileMetadata = async (creationId, metadata) => {
  try {
    const filesCollection = db
      .collection('cart')
      .doc(creationId)
      .collection('files'); // Reference to the 'files' sub-collection
    await filesCollection.add({
      ...metadata, // Spread file metadata
      uploadedAt: new Date().toISOString(), // Set upload timestamp
    });
    console.log(`File metadata saved successfully for creationId: ${creationId}`);
  } catch (error) {
    console.error('Error saving file metadata:', error);
    throw error;
  }
};
