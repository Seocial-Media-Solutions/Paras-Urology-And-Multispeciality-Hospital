'use client';

import { useEffect, useState } from 'react';
import {
  Upload, Loader2, Trash2, Edit, Plus, X, Save, Image, ZoomIn
} from 'lucide-react';

// Firestore helper functions you provided
import {
  getEmpanelments as fbGetEmpanelments,
  addEmpanelment as fbAddEmpanelment,
  updateEmpanelment as fbUpdateEmpanelment,
  deleteEmpanelment as fbDeleteEmpanelment
} from '@/lib/firebase/empanelments';

// Firebase storage functions (adjust path if your config file is elsewhere)
import { storage } from '@/lib/firebase/config'; // <-- ensure this exists and exports "storage"
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Admin panel:
 * - Uses your Firestore helpers (get/add/update/delete)
 * - Uploads/deletes images to Firebase Storage and stores imageUrl + imagePath in Firestore docs
 */

// Minimal toast implementation (UI-only)
const toast = {
  success: (msg, id) => showToast(msg, 'success', id),
  error: (msg, id) => showToast(msg, 'error', id),
  loading: (msg, id) => showToast(msg, 'loading', id),
};

function showToast(msg, type = 'success', id = undefined) {
  const containerId = 'toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
  }

  const toastId = id || `toast-${Date.now()}`;
  const existing = document.getElementById(toastId);
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = toastId;
  el.className = `px-4 py-3 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  } animate-slide-in`;
  el.textContent = msg;
  container.appendChild(el);

  if (type !== 'loading') {
    setTimeout(() => {
      el.classList.add('animate-fade-out');
      setTimeout(() => el.remove(), 300);
    }, 2500);
  }
  return toastId;
}

// Sorting with "order" prioritized (client-side)
const sortWithOrder = (arr) => {
  return arr.slice().sort((a, b) => {
    const aHas = a.order !== undefined && a.order !== null && a.order !== '';
    const bHas = b.order !== undefined && b.order !== null && b.order !== '';
    if (aHas && bHas) return Number(a.order) - Number(b.order);
    if (aHas) return -1;
    if (bHas) return 1;

    const aTime = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
};

export default function EmpanelmentsAdminPanel() {
  const [empanelments, setEmpanelments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('government');
  const [lightboxImage, setLightboxImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'government',
    imageUrl: '',
    imagePath: '',
    order: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadEmpanelments();
  }, []);

  // Fetch using your helper
  const loadEmpanelments = async () => {
    setLoading(true);
    try {
      const res = await fbGetEmpanelments();
      if (res.success) {
        setEmpanelments(res.data || []);
      } else {
        toast.error(res.error || 'Failed to load empanelments');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading empanelments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    toast.success('Logo selected');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'government', imageUrl: '', imagePath: '', order: '' });
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
    setShowForm(false);
  };

  // Upload file to Firebase Storage
  const uploadToStorage = (file, filenameHint = 'logo') => {
    return new Promise((resolve, reject) => {
      try {
        const ext = file.name.split('.').pop();
        const filename = `${filenameHint.replace(/\s+/g, '_')}_${Date.now()}.${ext}`;
        const path = `empanelments/logos/${filename}`;
        const sRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(sRef, file);

        uploadTask.on('state_changed',
          () => { /* can implement progress if needed */ },
          (err) => {
            reject(err);
          },
          async () => {
            try {
              const url = await getDownloadURL(sRef);
              resolve({ success: true, url, path });
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  // Delete file from Storage (path like 'empanelments/logos/name.ext')
  const deleteFromStorage = async (path) => {
    if (!path) return { success: false, error: 'No path provided' };
    try {
      const sRef = storageRef(storage, path);
      await deleteObject(sRef);
      return { success: true };
    } catch (err) {
      // treat "object-not-found" as success if you prefer
      console.warn('deleteFromStorage error', err.code, err.message);
      if (err.code && err.code === 'storage/object-not-found') return { success: true };
      return { success: false, error: err.message || err.toString() };
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Please fill required fields (Name & Category)');
      return;
    }

    // require image when creating new item
    if (!editingItem && !imageFile && !formData.imageUrl) {
      toast.error('Please upload a logo image');
      return;
    }

    let orderNum = null;
    if (formData.order !== '' && formData.order !== null) {
      orderNum = Number(formData.order);
      if (isNaN(orderNum) || orderNum < 1) {
        toast.error('Order must be a positive number (1 or greater)');
        return;
      }
    }

    setUploading(true);
    const loadingId = toast.loading(editingItem ? 'Updating empanelment...' : 'Adding empanelment...');

    try {
      let imageUrl = formData.imageUrl || '';
      let imagePath = formData.imagePath || '';

      // upload new file if present
      if (imageFile) {
        toast.loading('Uploading logo...', loadingId);
        const upl = await uploadToStorage(imageFile, formData.name || 'logo');
        if (!upl || !upl.success) throw new Error((upl && upl.error) || 'Upload failed');
        imageUrl = upl.url;
        imagePath = upl.path;

        // if editingItem had an old imagePath, delete it
        if (editingItem && editingItem.imagePath) {
          toast.loading('Removing old logo...', loadingId);
          await deleteFromStorage(editingItem.imagePath).catch(err => {
            console.warn('Failed to delete old image (continuing):', err);
          });
        }
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        imageUrl,
        imagePath,
        order: orderNum !== null ? orderNum : null
      };

      let res;
      if (editingItem) {
        res = await fbUpdateEmpanelment(editingItem.id, payload);
      } else {
        res = await fbAddEmpanelment(payload);
      }

      if (res.success) {
        await loadEmpanelments();
        resetForm();
        toast.success(editingItem ? 'Empanelment updated' : 'Empanelment added', loadingId);
      } else {
        throw new Error(res.error || 'Firestore error');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error saving empanelment', loadingId);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'government',
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
      order: item.order !== undefined && item.order !== null ? item.order : ''
    });
    setImagePreview(item.imageUrl || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"? This will remove the record${item.imagePath ? ' and its logo' : ''}.`)) return;

    const loadingId = toast.loading('Deleting empanelment...');
    try {
      if (item.imagePath) {
        toast.loading('Deleting logo...', loadingId);
        const d = await deleteFromStorage(item.imagePath);
        if (!d.success) {
          console.warn('Failed to delete logo (continuing):', d.error);
        }
      }

      const res = await fbDeleteEmpanelment(item.id);
      if (!res.success) throw new Error(res.error || 'Failed to delete record');

      await loadEmpanelments();
      toast.success('Deleted successfully', loadingId);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error deleting empanelment', loadingId);
    }
  };

  const getCategoryEmpanelments = (category) => {
    const items = empanelments.filter(i => i.category === category);
    return sortWithOrder(items);
  };

  const categories = [
    { id: 'government', name: 'Government Insurance & TPAs' },
    { id: 'private', name: 'Private Insurance Companies' },
    { id: 'corporate', name: 'Corporate Empanelments' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading empanelments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
        .animate-slide-in { animation: slide-in 0.28s ease-out; }
        .animate-fade-out { animation: fade-out 0.2s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Empanelments Management</h1>
            <p className="text-gray-600 mt-2">Manage empanelments — add, edit, reorder, and remove logos</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Empanelment
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{editingItem ? 'Edit Empanelment' : 'Add New Empanelment'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700" disabled={uploading}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleInputChange} disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all">
                    <option value="government">Government Insurance & TPAs</option>
                    <option value="private">Private Insurance Companies</option>
                    <option value="corporate">Corporate Empanelments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order <span className="text-xs text-gray-500">(Optional)</span></label>
                  <input type="number" name="order" value={formData.order} onChange={handleInputChange} disabled={uploading}
                    min="1" step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                    placeholder="Enter order number" />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Leave blank for automatic ordering.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image <span className="text-red-500">*</span> {editingItem && <span className="text-yellow-600">(Upload new to replace)</span>}</label>

                {imagePreview && (
                  <div className="mb-4 relative inline-block">
                    <img src={imagePreview} alt="Preview"
                      className="w-40 h-40 object-contain rounded-lg border-2 border-blue-500 bg-white p-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setLightboxImage({ url: imagePreview, name: 'Preview' })} />
                    <button onClick={() => setLightboxImage({ url: imagePreview, name: 'Preview' })}
                      className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                      title="View full size">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    {editingItem && imageFile && <div className="absolute bottom-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">Will Replace</div>}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">{editingItem ? 'Click to upload new logo' : 'Click to upload logo'}</span>
                  <span className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={handleSubmit} disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md">
                  {uploading ? (<><Loader2 className="w-5 h-5 animate-spin" />Saving...</>) : (<><Save className="w-5 h-5" />{editingItem ? 'Update Empanelment' : 'Add Empanelment'}</>)}
                </button>
                <button onClick={resetForm} disabled={uploading}
                  className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {categories.map((cat) => {
              const count = getCategoryEmpanelments(cat.id).length;
              return (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${ activeTab === cat.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50' }`}>
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {categories.map((cat) => {
              if (activeTab !== cat.id) return null;
              const items = getCategoryEmpanelments(cat.id);

              return (
                <div key={cat.id}>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">{cat.name}</h2>

                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Image className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No empanelments added yet</p>
                      <p className="text-sm">Click "Add Empanelment" to create one</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative group">
                            {item.imageUrl ? (
                              <>
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain cursor-pointer"
                                  onClick={() => setLightboxImage({ url: item.imageUrl, name: item.name })} />
                                <button onClick={() => setLightboxImage({ url: item.imageUrl, name: item.name })}
                                  className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                                  title="View full size">
                                  <ZoomIn className="w-4 h-4" />
                                </button>
                                {(item.order !== undefined && item.order !== null) && (
                                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">#{item.order}</div>
                                )}
                              </>
                            ) : (
                              <Image className="w-12 h-12 text-gray-300" />
                            )}
                          </div>

                          <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem]">{item.name}</h3>
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(item)} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-xs">
                                <Edit className="w-3 h-3" /> Edit
                              </button>
                              <button onClick={() => handleDelete(item)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
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

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.url} alt={lightboxImage.name} className="max-w-full max-h-[80vh] object-contain" />
            <p className="text-white text-lg mt-4 text-center">{lightboxImage.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
