'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, Trash2, Edit, Plus, X, Save, User } from 'lucide-react';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '@/lib/firebase/doctors';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary/upload';
import toast from 'react-hot-toast';

export default function DoctorManagementPanel() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    education: '',
    experience: '',
    expertise: '',
    achievements: '',
    about: '',
    timing: '',
    memberships: '',
    imageUrl: '',
    displayOrder: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const result = await getDoctors();
    if (result.success) {
      setDoctors(result.data);
    } else {
      toast.error(result.error || 'Failed to load doctors');
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
      reader.onloadend = () => setImagePreview(reader.result);
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
      name: '',
      education: '',
      experience: '',
      expertise: '',
      achievements: '',
      about: '',
      timing: '',
      memberships: '',
      imageUrl: '',
      displayOrder: 0,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingDoctor(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    // Only validate doctor name as required
    if (!formData.name || !formData.name.trim()) {
      toast.error('Please enter doctor name');
      return;
    }

    if (!editingDoctor && !imageFile && !formData.imageUrl) {
      toast.error('Please upload a doctor image');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading(editingDoctor ? 'Updating doctor...' : 'Adding doctor...');

    try {
      let imageUrl = formData.imageUrl;
      let oldImageUrl = editingDoctor?.imageUrl;

      if (imageFile) {
        toast.loading('Uploading new image...', { id: uploadToast });
        const uploadResult = await uploadToCloudinary(imageFile);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }

        imageUrl = uploadResult.url;

        if (editingDoctor && oldImageUrl) {
          const oldPublicId = extractPublicId(oldImageUrl);
          if (oldPublicId) {
            toast.loading('Removing old image...', { id: uploadToast });
            await deleteFromCloudinary(oldPublicId);
          }
        }
      }

      const doctorData = {
        name: formData.name.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        expertise: formData.expertise.trim(),
        achievements: formData.achievements.trim(),
        about: formData.about.trim(),
        timing: formData.timing.trim(),
        memberships: formData.memberships
          .split('\n')
          .map(m => m.trim())
          .filter(m => m.length > 0),
        imageUrl,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      let result;
      if (editingDoctor) {
        result = await updateDoctor(editingDoctor.id, doctorData);
      } else {
        result = await addDoctor(doctorData);
      }

      if (result.success) {
        await loadDoctors();
        resetForm();
        toast.success(editingDoctor ? 'Doctor updated successfully!' : 'Doctor added successfully!', {
          id: uploadToast,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error saving doctor profile', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      education: doctor.education || '',
      experience: doctor.experience || '',
      expertise: doctor.expertise || '',
      achievements: doctor.achievements || '',
      about: doctor.about || '',
      timing: doctor.timing || '',
      memberships: Array.isArray(doctor.memberships)
        ? doctor.memberships.join('\n')
        : (doctor.memberships || ''),
      imageUrl: doctor.imageUrl || '',
      displayOrder: doctor.displayOrder ?? 0,
    });
    setImagePreview(doctor.imageUrl || '');
    setShowForm(true);
  };

  const handleDelete = async (id, name, imageUrl) => {
    if (!confirm(`Are you sure you want to delete Dr. ${name}?`)) return;

    const deleteToast = toast.loading('Deleting doctor...');

    try {
      if (imageUrl) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) await deleteFromCloudinary(publicId);
      }

      const result = await deleteDoctor(id);

      if (result.success) {
        await loadDoctors();
        toast.success('Doctor deleted successfully!', { id: deleteToast });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting doctor', { id: deleteToast });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
            <p className="text-gray-600 mt-2">Manage doctor profiles and information</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Doctor
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={resetForm} disabled={uploading}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-6">
              
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Doctor Name - ONLY REQUIRED FIELD */}
                <div>
                  <label className="block text-sm font-medium mb-2">Doctor Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Dr. John Doe"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="MBBS, MS"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="10+ Years"
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium mb-2">Expertise</label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Laparoscopy, Hernia"
                  />
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-sm font-medium mb-2">Timing</label>
                  <input
                    type="text"
                    name="timing"
                    value={formData.timing}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Mon–Sat (10 AM - 1 PM)"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort Order (Lower = First)
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="1"
                  />
                </div>

              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium mb-2">Achievements</label>
                <input
                  type="text"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  disabled={uploading}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Performed 65000+ surgeries"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium mb-2">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={uploading}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Write about the doctor..."
                />
              </div>

              {/* Memberships */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Memberships (One per line)
                </label>
                <textarea
                  name="memberships"
                  value={formData.memberships}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={uploading}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Indian Medical Association&#10;ASICON"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Doctor Image {editingDoctor && '(Upload new to replace)'}
                </label>

                {imagePreview && (
                  <div className="mb-4">
                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
                  </div>
                )}

                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                >
                  {uploading ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>

                <button
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-8 bg-gray-200 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* DOCTOR LIST */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">All Doctors ({doctors.length})</h2>

          {doctors.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <User className="w-16 h-16 mb-4" />
              <p>No doctors added yet</p>
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="border rounded-lg overflow-hidden hover:shadow-lg">

                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {doctor.imageUrl ? (
                    <img src={doctor.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-gray-400" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold">{doctor.name}</h3>
                  {doctor.education && <p className="text-sm text-blue-600 mb-3">{doctor.education}</p>}
                  {doctor.experience && <p className="text-sm"><b>Experience:</b> {doctor.experience}</p>}
                  {doctor.expertise && <p className="text-sm"><b>Expertise:</b> {doctor.expertise}</p>}

                  <p className="text-xs mt-2 text-gray-500">Display Order: {doctor.displayOrder}</p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        handleEdit(doctor);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(doctor.id, doctor.name, doctor.imageUrl)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}