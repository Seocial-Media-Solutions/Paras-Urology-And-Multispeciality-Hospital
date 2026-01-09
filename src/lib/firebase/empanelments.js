import { 
  collection,
  doc, 
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection reference
const EMPANELMENTS_COLLECTION = 'empanelments';

/**
 * Get all empanelments
 * Items with order will be sorted first, then items without order
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getEmpanelments = async () => {
  try {
    const empanelmentsRef = collection(db, EMPANELMENTS_COLLECTION);
    const querySnapshot = await getDocs(empanelmentsRef);
    
    const empanelments = [];
    querySnapshot.forEach((doc) => {
      empanelments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort in memory: items with order first (sorted by order), then items without order (sorted by createdAt)
    empanelments.sort((a, b) => {
      // If both have order, sort by order
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // If only a has order, a comes first
      if (a.order !== undefined) {
        return -1;
      }
      // If only b has order, b comes first
      if (b.order !== undefined) {
        return 1;
      }
      // Neither has order, sort by createdAt (newest first)
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
    
    return { success: true, data: empanelments };
  } catch (error) {
    console.error('Error getting empanelments:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get single empanelment by ID
 * @param {string} empanelmentId - The empanelment's document ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getEmpanelment = async (empanelmentId) => {
  try {
    const empanelmentRef = doc(db, EMPANELMENTS_COLLECTION, empanelmentId);
    const empanelmentSnap = await getDoc(empanelmentRef);
    
    if (empanelmentSnap.exists()) {
      return { 
        success: true, 
        data: {
          id: empanelmentSnap.id,
          ...empanelmentSnap.data()
        }
      };
    } else {
      return { success: false, error: 'Empanelment not found' };
    }
  } catch (error) {
    console.error('Error getting empanelment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add new empanelment
 * @param {Object} empanelmentData - Empanelment information (order is optional)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const addEmpanelment = async (empanelmentData) => {
  try {
    // Generate unique ID
    const empanelmentRef = doc(collection(db, EMPANELMENTS_COLLECTION));
    
    const newEmpanelment = {
      ...empanelmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Convert order to number if provided
    if (newEmpanelment.order !== undefined && newEmpanelment.order !== null && newEmpanelment.order !== '') {
      newEmpanelment.order = Number(newEmpanelment.order);
    }
    
    await setDoc(empanelmentRef, newEmpanelment);
    
    return { 
      success: true, 
      data: {
        id: empanelmentRef.id,
        ...newEmpanelment
      }
    };
  } catch (error) {
    console.error('Error adding empanelment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update existing empanelment
 * @param {string} empanelmentId - The empanelment's document ID
 * @param {Object} empanelmentData - Updated empanelment information
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const updateEmpanelment = async (empanelmentId, empanelmentData) => {
  try {
    const empanelmentRef = doc(db, EMPANELMENTS_COLLECTION, empanelmentId);
    
    const updatedEmpanelment = {
      ...empanelmentData,
      updatedAt: serverTimestamp()
    };

    // Convert order to number if provided
    if (updatedEmpanelment.order !== undefined && updatedEmpanelment.order !== null && updatedEmpanelment.order !== '') {
      updatedEmpanelment.order = Number(updatedEmpanelment.order);
    }
    
    await setDoc(empanelmentRef, updatedEmpanelment, { merge: true });
    
    return { 
      success: true,
      data: {
        id: empanelmentId,
        ...updatedEmpanelment
      }
    };
  } catch (error) {
    console.error('Error updating empanelment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete empanelment
 * @param {string} empanelmentId - The empanelment's document ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteEmpanelment = async (empanelmentId) => {
  try {
    const empanelmentRef = doc(db, EMPANELMENTS_COLLECTION, empanelmentId);
    await deleteDoc(empanelmentRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting empanelment:', error);
    return { success: false, error: error.message };
  }
};