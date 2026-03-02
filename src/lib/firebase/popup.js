import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const POPUP_COLLECTION = 'popup_banners';
const MAX_BANNERS = 10;

/**
 * Get all popup banners
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAllPopupBanners = async () => {
    try {
        const bannersRef = collection(db, POPUP_COLLECTION);
        const q = query(bannersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const banners = [];
        querySnapshot.forEach((doc) => {
            banners.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, data: banners };
    } catch (error) {
        console.error('Error getting popup banners:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get the currently active popup banner
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getActivePopupBanner = async () => {
    try {
        const bannersRef = collection(db, POPUP_COLLECTION);
        const q = query(bannersRef, where('isActive', '==', true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                success: true,
                data: { id: doc.id, ...doc.data() }
            };
        }

        return { success: false, error: 'No active popup banner' };
    } catch (error) {
        console.error('Error getting active popup banner:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Add a new popup banner
 * @param {Object} bannerData
 * @param {string} bannerData.imageUrl - Cloudinary image URL
 * @param {string} bannerData.title - Banner title
 * @param {boolean} bannerData.isActive - Whether this banner is active
 * @param {number} bannerData.autoCloseSeconds - Auto close time
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const addPopupBanner = async (bannerData) => {
    try {
        // Check max limit
        const existing = await getAllPopupBanners();
        if (existing.success && existing.data.length >= MAX_BANNERS) {
            return { success: false, error: `Maximum ${MAX_BANNERS} banners allowed. Delete one before adding.` };
        }

        // If this banner is set as active, deactivate all others
        if (bannerData.isActive) {
            await deactivateAllBanners();
        }

        const bannerRef = doc(collection(db, POPUP_COLLECTION));

        const newBanner = {
            imageUrl: bannerData.imageUrl,
            title: bannerData.title || '',
            isActive: bannerData.isActive || false,
            autoCloseSeconds: bannerData.autoCloseSeconds || 15,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(bannerRef, newBanner);

        return {
            success: true,
            data: { id: bannerRef.id, ...newBanner }
        };
    } catch (error) {
        console.error('Error adding popup banner:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update an existing popup banner
 * @param {string} bannerId
 * @param {Object} bannerData
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updatePopupBanner = async (bannerId, bannerData) => {
    try {
        const bannerRef = doc(db, POPUP_COLLECTION, bannerId);
        const bannerSnap = await getDoc(bannerRef);

        if (!bannerSnap.exists()) {
            return { success: false, error: 'Banner not found' };
        }

        // If setting as active, deactivate all others first
        if (bannerData.isActive) {
            await deactivateAllBanners();
        }

        await setDoc(bannerRef, {
            ...bannerData,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error updating popup banner:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Set a specific banner as active (deactivates all others)
 * @param {string} bannerId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const setActiveBanner = async (bannerId) => {
    try {
        // Deactivate all banners first
        await deactivateAllBanners();

        // Activate the selected one
        const bannerRef = doc(db, POPUP_COLLECTION, bannerId);
        await setDoc(bannerRef, {
            isActive: true,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error setting active banner:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Deactivate all banners
 * @returns {Promise<void>}
 */
const deactivateAllBanners = async () => {
    const bannersRef = collection(db, POPUP_COLLECTION);
    const q = query(bannersRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);

    const updates = querySnapshot.docs.map((docSnap) => {
        return setDoc(doc(db, POPUP_COLLECTION, docSnap.id), {
            isActive: false,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    });

    await Promise.all(updates);
};

/**
 * Deactivate a specific banner
 * @param {string} bannerId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deactivateBanner = async (bannerId) => {
    try {
        const bannerRef = doc(db, POPUP_COLLECTION, bannerId);
        await setDoc(bannerRef, {
            isActive: false,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error deactivating banner:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a popup banner
 * @param {string} bannerId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deletePopupBanner = async (bannerId) => {
    try {
        const bannerRef = doc(db, POPUP_COLLECTION, bannerId);
        const bannerSnap = await getDoc(bannerRef);

        if (!bannerSnap.exists()) {
            return { success: false, error: 'Banner not found' };
        }

        await deleteDoc(bannerRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting popup banner:', error);
        return { success: false, error: error.message };
    }
};
