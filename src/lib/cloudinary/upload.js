/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hospital_images');
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    formData.append('folder', 'paras-hospital');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      console.error('Cloudinary upload error:', data);
      return {
        success: false,
        error: data.error?.message || 'Upload failed',
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Network error during upload',
    };
  }
};

/**
 * Delete image from Cloudinary via API route
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    } else {
      console.error('Cloudinary delete error:', data);
      return {
        success: false,
        error: data.error || 'Delete failed',
      };
    }
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message || 'Network error during delete',
    };
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - The Cloudinary image URL
 * @returns {string|null} - The public ID or null if invalid
 */
export const extractPublicId = (url) => {
  try {
    // Example URL: https://res.cloudinary.com/dnd8u5sll/image/upload/v1234567890/paras-hospital/image.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v123456789/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    return pathAfterUpload.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};