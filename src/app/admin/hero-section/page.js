'use client';

import { useState, useEffect } from 'react';
import { Upload, Image, Loader2, Check, X, Trash2 } from 'lucide-react';
import { updateHeroImage, getHeroData } from '@/lib/firebase/firestore';
import { deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary/upload';
import toast from 'react-hot-toast';

export default function HeroSectionPage() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentImages();
  }, []);

  const loadCurrentImages = async () => {
    const result = await getHeroData();
    if (result.success && result.data?.imageUrls && Array.isArray(result.data.imageUrls)) {
      setCurrentImages(result.data.imageUrls);
    } else if (result.success && result.data?.imageUrl) {
      setCurrentImages([result.data.imageUrl]);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} image(s) selected`);
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      if (!uploadPreset) {
        throw new Error('Cloudinary upload preset is not configured');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'hospital_images');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
      }

      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select at least one image first');
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        toast.loading(`Uploading image ${i + 1} of ${imageFiles.length}...`, {
          id: 'upload-progress'
        });
        const { url } = await uploadToCloudinary(imageFiles[i]);
        uploadedUrls.push(url);
      }
      
      toast.dismiss('upload-progress');

      const allImages = [...currentImages, ...uploadedUrls];
      
      const result = await updateHeroImage(allImages);
      
      if (result.success) {
        setCurrentImages(allImages);
        setImageFiles([]);
        setImagePreviews([]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      } else {
        toast.error(result.error || 'Failed to update hero images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreview = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCurrent = async (index) => {
    if (!confirm('Are you sure you want to delete this image? It will be permanently removed from Cloudinary.')) {
      return;
    }

    const imageUrl = currentImages[index];
    const publicId = extractPublicId(imageUrl);

    if (!publicId) {
      toast.error('Could not extract image ID. Delete manually from Cloudinary.');
      return;
    }

    try {
      toast.loading('Deleting image...', { id: 'delete-progress' });

      // Delete from Cloudinary first
      const cloudinaryResult = await deleteFromCloudinary(publicId);
      
      if (!cloudinaryResult.success) {
        toast.dismiss('delete-progress');
        toast.error(`Failed to delete from Cloudinary: ${cloudinaryResult.error}`);
        return;
      }

      // Then update Firebase
      const newImages = currentImages.filter((_, i) => i !== index);
      const firestoreResult = await updateHeroImage(newImages);
      
      toast.dismiss('delete-progress');
      
      if (firestoreResult.success) {
        setCurrentImages(newImages);
        toast.success('Image deleted successfully from Cloudinary and database!');
      } else {
        toast.error(firestoreResult.error || 'Failed to update database after deletion');
      }
    } catch (error) {
      toast.dismiss('delete-progress');
      console.error('Delete error:', error);
      toast.error('Error deleting image: ' + error.message);
    }
  };

  const handleCancelAll = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Hero Section</h1>
        <p className="text-gray-600 mt-2">
          Manage hero images displayed on your homepage slider
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Current Hero Images ({currentImages.length})
        </h2>
        
        {currentImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={image}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteCurrent(index)}
                    className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                    title="Delete from Cloudinary and database"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images uploaded yet</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Images</h2>
        
        <div className="space-y-4">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden border-2 border-blue-500">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => handleRemovePreview(index)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-lg hover:bg-gray-100"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600 mb-1">Click to upload images</span>
            <span className="text-xs text-gray-500">PNG, JPG up to 5MB each</span>
            <span className="text-xs text-gray-500 mt-1">Multiple files supported</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              multiple
              disabled={uploading}
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Upload {imagePreviews.length} Image(s)
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancelAll}
                disabled={uploading}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Image Guidelines:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Recommended size: 1920x1080 pixels</li>
            <li>• File format: JPG, PNG</li>
            <li>• Maximum size: 5MB per image</li>
            <li>• Upload multiple images for slider effect</li>
            <li>• Images will auto-rotate in the hero section</li>
            <li>• Deleted images are permanently removed from Cloudinary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}