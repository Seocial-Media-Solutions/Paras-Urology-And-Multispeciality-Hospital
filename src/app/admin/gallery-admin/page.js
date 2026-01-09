'use client';
import { useState, useEffect } from 'react';
import { Upload, Loader2, Trash2, Edit, Plus, X, Save, ZoomIn, Newspaper, Calendar, ImageIcon } from 'lucide-react';
import { getGalleries, addGallery, updateGallery, deleteGallery } from '@/lib/firebase/galleries';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary/upload';
import toast from 'react-hot-toast';

export default function GalleryAdminPanel() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    type: 'events',
    description: '',
    date: new Date().toISOString().split('T')[0],
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    setLoading(true);
    const result = await getGalleries();
    if (result.success) {
      setGalleries(result.data);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 10MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFiles(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, { 
          file: file.name, 
          url: reader.result,
          name: '',
          description: ''
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updatePreviewImageDetails = (index, field, value) => {
    setImagePreviews(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const updateExistingImageDetails = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'events',
      description: '',
      date: new Date().toISOString().split('T')[0],
      images: []
    });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingItem(null);
    setShowForm(false);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!editingItem && imageFiles.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let uploadedImages = [...(formData.images || [])];

      if (imageFiles.length > 0) {
        const totalFiles = imageFiles.length;
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const preview = imagePreviews[i];
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
          
          const uploadResult = await uploadToCloudinary(file);
          
          if (!uploadResult.success) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          
          uploadedImages.push({
            url: uploadResult.url,
            name: preview.name || '',
            description: preview.description || '',
            uploadedAt: new Date().toISOString()
          });
        }
      }

      const galleryData = {
        title: formData.title.trim(),
        type: formData.type,
        description: formData.description.trim(),
        date: formData.date,
        images: uploadedImages
      };

      let result;
      if (editingItem) {
        result = await updateGallery(editingItem.id, galleryData);
      } else {
        result = await addGallery(galleryData);
      }

      if (result.success) {
        await loadGalleries();
        resetForm();
        alert(editingItem ? 'Gallery updated successfully!' : 'Gallery added successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error saving gallery');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      type: item.type || 'events',
      description: item.description || '',
      date: item.date || new Date().toISOString().split('T')[0],
      images: (item.images || []).map(img => ({
        ...img,
        name: img.name || '',
        description: img.description || ''
      }))
    });
    setImageFiles([]);
    setImagePreviews([]);
    setShowForm(true);
  };

  const handleDelete = async (id, title, images) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will delete all ${images?.length || 0} images from Cloudinary.`)) {
      return;
    }

    setLoading(true);
    
    try {
      if (images && images.length > 0) {
        for (const image of images) {
          const publicId = extractPublicId(image.url);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
      }

      const result = await deleteGallery(id);
      
      if (result.success) {
        await loadGalleries();
        alert('Gallery deleted successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'Error deleting gallery');
    } finally {
      setLoading(false);
    }
  };

  const getTypeGalleries = (type) => {
    return galleries.filter(item => item.type === type);
  };

  const tabs = [
    { id: 'events', name: 'Events Gallery', icon: Calendar, color: 'blue' },
    { id: 'newspaper', name: 'Newspaper Media', icon: Newspaper, color: 'purple' }
  ];

  if (loading && galleries.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
            <p className="text-gray-600 mt-2">Manage events and newspaper media galleries</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Gallery
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingItem ? 'Edit Gallery' : 'Add New Gallery'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter gallery title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="events">Events Gallery</option>
                    <option value="newspaper">Newspaper Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={uploading}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter gallery description (optional)"
                />
              </div>

              {/* Existing Images Section */}
              {editingItem && formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Existing Images ({formData.images.length})
                  </label>
                  <div className="space-y-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="relative group flex-shrink-0">
                          <img
                            src={image.url}
                            alt={image.name || `Existing ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setLightboxImage({ url: image.url, title: image.name || `${formData.title} - Image ${index + 1}`, description: image.description })}
                          />
                          <button
                            onClick={() => removeExistingImage(index)}
                            disabled={uploading}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Name (optional)
                            </label>
                            <input
                              type="text"
                              value={image.name || ''}
                              onChange={(e) => updateExistingImageDetails(index, 'name', e.target.value)}
                              disabled={uploading}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Enter image name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Description (optional)
                            </label>
                            <textarea
                              value={image.description || ''}
                              onChange={(e) => updateExistingImageDetails(index, 'description', e.target.value)}
                              disabled={uploading}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Enter image description"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview Section */}
              {imagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    New Images to Upload ({imagePreviews.length})
                  </label>
                  <div className="space-y-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="relative group flex-shrink-0">
                          <img
                            src={preview.url}
                            alt={preview.name || `Preview ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setLightboxImage({ url: preview.url, title: preview.name || `Preview ${index + 1}`, description: preview.description })}
                          />
                          <button
                            onClick={() => removeImage(index)}
                            disabled={uploading}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            New
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Name (optional)
                            </label>
                            <input
                              type="text"
                              value={preview.name}
                              onChange={(e) => updatePreviewImageDetails(index, 'name', e.target.value)}
                              disabled={uploading}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Enter image name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Description (optional)
                            </label>
                            <textarea
                              value={preview.description}
                              onChange={(e) => updatePreviewImageDetails(index, 'description', e.target.value)}
                              disabled={uploading}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Enter image description"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images * {editingItem && '(Add more images)'}
                </label>
                <label className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 font-semibold">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Select multiple images (PNG, JPG up to 10MB each)
                  </span>
                  <span className="text-xs text-blue-600 mt-2">
                    Recommended: 6-8 images per gallery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading images...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingItem ? 'Update Gallery' : 'Create Gallery'}
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const count = getTypeGalleries(tab.id).length;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {tabs.map((tab) => {
              if (activeTab !== tab.id) return null;
              
              const items = getTypeGalleries(tab.id);
              const Icon = tab.icon;
              
              return (
                <div key={tab.id}>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Icon className="w-6 h-6" />
                    {tab.name}
                  </h2>

                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <ImageIcon className="w-16 h-16 mb-4" />
                      <p className="text-lg">No galleries added yet</p>
                      <p className="text-sm">Click "Add Gallery" to create one</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  <span>•</span>
                                  <span>{item.images?.length || 0} images</span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id, item.title, item.images)}
                                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {item.images && item.images.length > 0 && (
                            <div className="p-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {item.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative group">
                                    <div className="aspect-square">
                                      <img
                                        src={image.url}
                                        alt={image.name || `${item.title} - ${imgIndex + 1}`}
                                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setLightboxImage({ url: image.url, title: image.name || `${item.title} - Image ${imgIndex + 1}`, description: image.description })}
                                      />
                                    </div>
                                    <button
                                      onClick={() => setLightboxImage({ url: image.url, title: image.name || `${item.title} - Image ${imgIndex + 1}`, description: image.description })}
                                      className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                                    >
                                      <ZoomIn className="w-4 h-4" />
                                    </button>
                                    {(image.name || image.description) && (
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                                        {image.name && (
                                          <p className="text-white text-xs font-semibold truncate">{image.name}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox with image name and description */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-7xl max-h-[95vh] flex flex-col items-center">
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">{lightboxImage.title}</p>
              {lightboxImage.description && (
                <p className="text-gray-300 text-sm mt-2 max-w-2xl">{lightboxImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}