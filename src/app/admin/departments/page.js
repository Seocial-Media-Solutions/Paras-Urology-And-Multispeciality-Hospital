'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, Trash2, Edit, Plus, X, Save, Building2 } from 'lucide-react';
import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '@/lib/firebase/departments';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary/upload';
import toast from 'react-hot-toast';

export default function DepartmentManagementPanel() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const formRef = useRef(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    const result = await getDepartments();
    if (result.success) {
      setDepartments(result.data);
    } else {
      toast.error(result.error || 'Failed to load departments');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
    setEditingDepartment(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingDepartment && !imageFile && !formData.imageUrl) {
      toast.error('Please upload a department image');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading(editingDepartment ? 'Updating department...' : 'Adding department...');

    try {
      let imageUrl = formData.imageUrl;
      let oldImageUrl = editingDepartment?.imageUrl;

      if (imageFile) {
        toast.loading('Uploading new image...', { id: uploadToast });
        const uploadResult = await uploadToCloudinary(imageFile);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }

        imageUrl = uploadResult.url;

        if (editingDepartment && oldImageUrl) {
          const oldPublicId = extractPublicId(oldImageUrl);
          if (oldPublicId) {
            toast.loading('Removing old image...', { id: uploadToast });
            const deleteResult = await deleteFromCloudinary(oldPublicId);
            if (!deleteResult.success) {
              console.warn('Failed to delete old image from Cloudinary:', deleteResult.error);
            }
          }
        }
      }

      const departmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl
      };

      let result;
      if (editingDepartment) {
        result = await updateDepartment(editingDepartment.id, departmentData);
      } else {
        result = await addDepartment(departmentData);
      }

      if (result.success) {
        await loadDepartments();
        resetForm();
        toast.success(
          editingDepartment ? 'Department updated successfully!' : 'Department added successfully!',
          { id: uploadToast }
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error saving department', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      title: department.title || '',
      description: department.description || '',
      imageUrl: department.imageUrl || ''
    });
    setImagePreview(department.imageUrl || '');
    setShowForm(true);
    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (id, title, imageUrl) => {
    if (!confirm(`Are you sure you want to delete "${title}" department? This will also delete the image from Cloudinary.`)) {
      return;
    }

    const deleteToast = toast.loading('Deleting department...');

    try {
      if (imageUrl) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          toast.loading('Deleting image from Cloudinary...', { id: deleteToast });
          const cloudinaryResult = await deleteFromCloudinary(publicId);

          if (!cloudinaryResult.success) {
            console.warn('Failed to delete image from Cloudinary:', cloudinaryResult.error);
          }
        }
      }

      toast.loading('Deleting department...', { id: deleteToast });
      const result = await deleteDepartment(id);

      if (result.success) {
        await loadDepartments();
        toast.success('Department and image deleted successfully!', { id: deleteToast });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Error deleting department', { id: deleteToast });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
            <p className="text-gray-600 mt-2">Manage hospital departments and services</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Department
            </button>
          )}
        </div>

        {showForm && (
          <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                  placeholder="e.g., Cardiology, Orthopedics, Neurology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={uploading}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all resize-none"
                  placeholder="Provide a detailed description of the department's services, specializations, and facilities..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Image * {editingDepartment && '(Upload new to replace)'}
                </label>
                {imagePreview && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-blue-500 shadow-sm"
                    />
                    {editingDepartment && imageFile && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        Will Replace
                      </div>
                    )}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">
                    {editingDepartment ? 'Click to upload new image' : 'Click to upload department image'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  {editingDepartment && (
                    <span className="text-xs text-yellow-600 mt-2 font-medium">
                      Old image will be deleted from Cloudinary
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingDepartment ? 'Update Department' : 'Add Department'}
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            All Departments ({departments.length})
          </h2>

          {departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Building2 className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No departments added yet</p>
              <p className="text-sm">Click "Add Department" to create one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                    {department.imageUrl ? (
                      <img
                        src={department.imageUrl}
                        alt={department.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Building2 className="w-20 h-20 text-blue-400" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {department.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {department.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 border border-blue-200"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id, department.title, department.imageUrl)}
                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}