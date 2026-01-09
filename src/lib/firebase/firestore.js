import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Get hero section data
export const getHeroData = async () => {
  try {
    const heroRef = doc(db, 'settings', 'hero');
    const heroSnap = await getDoc(heroRef);
    
    if (heroSnap.exists()) {
      return { success: true, data: heroSnap.data() };
    } else {
      return { success: false, error: 'No hero data found' };
    }
  } catch (error) {
    console.error('Error getting hero data:', error);
    return { success: false, error: error.message };
  }
};

// Update hero section image(s) - supports both single image and multiple images
export const updateHeroImage = async (imageUrlOrUrls) => {
  try {
    const heroRef = doc(db, 'settings', 'hero');
    
    // Handle both string (single image) and array (multiple images)
    let updateData;
    
    if (Array.isArray(imageUrlOrUrls)) {
      // Multiple images
      updateData = {
        imageUrls: imageUrlOrUrls,
        updatedAt: serverTimestamp()
      };
      
      // Keep single imageUrl for backward compatibility (use first image)
      if (imageUrlOrUrls.length > 0) {
        updateData.imageUrl = imageUrlOrUrls[0];
      }
    } else {
      // Single image (backward compatibility)
      updateData = {
        imageUrl: imageUrlOrUrls,
        imageUrls: [imageUrlOrUrls], // Also store as array
        updatedAt: serverTimestamp()
      };
    }
    
    await setDoc(heroRef, updateData, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating hero image:', error);
    return { success: false, error: error.message };
  }
};

// Get any setting
export const getSetting = async (settingName) => {
  try {
    const settingRef = doc(db, 'settings', settingName);
    const settingSnap = await getDoc(settingRef);
    
    if (settingSnap.exists()) {
      return { success: true, data: settingSnap.data() };
    } else {
      return { success: false, error: 'Setting not found' };
    }
  } catch (error) {
    console.error('Error getting setting:', error);
    return { success: false, error: error.message };
  }
};

// Update any setting
export const updateSetting = async (settingName, data) => {
  try {
    const settingRef = doc(db, 'settings', settingName);
    await setDoc(settingRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating setting:', error);
    return { success: false, error: error.message };
  }
};