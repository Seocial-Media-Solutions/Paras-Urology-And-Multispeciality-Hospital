'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, Check, X, Trash2, Eye, EyeOff, Clock, ImageIcon, Plus, Star } from 'lucide-react';
import {
    getAllPopupBanners,
    addPopupBanner,
    updatePopupBanner,
    deletePopupBanner,
    setActiveBanner,
    deactivateBanner
} from '@/lib/firebase/popup';
import { deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary/upload';
import toast from 'react-hot-toast';

const MAX_BANNERS = 10;

export default function PopupBannerPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Add form state
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newAutoClose, setNewAutoClose] = useState(15);
    const [newIsActive, setNewIsActive] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        const result = await getAllPopupBanners();
        if (result.success) {
            setBanners(result.data);
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image is too large. Maximum size is 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setNewImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setNewImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const uploadToCloudinary = async (file) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) throw new Error('Cloudinary config missing');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'popup_banners');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

        return { url: data.secure_url, publicId: data.public_id };
    };

    const handleAddBanner = async () => {
        if (!newImageFile) {
            toast.error('Please select an image');
            return;
        }
        if (banners.length >= MAX_BANNERS) {
            toast.error(`Maximum ${MAX_BANNERS} banners allowed. Delete one first.`);
            return;
        }

        setUploading(true);

        try {
            toast.loading('Uploading image...', { id: 'upload' });
            const { url } = await uploadToCloudinary(newImageFile);
            toast.dismiss('upload');

            const result = await addPopupBanner({
                imageUrl: url,
                title: newTitle,
                isActive: newIsActive,
                autoCloseSeconds: parseInt(newAutoClose) || 15,
            });

            if (result.success) {
                toast.success('Banner added successfully!');
                resetAddForm();
                await loadBanners();
            } else {
                toast.error(result.error || 'Failed to add banner');
            }
        } catch (error) {
            toast.dismiss('upload');
            toast.error(error.message || 'Error adding banner');
        } finally {
            setUploading(false);
        }
    };

    const handleSetActive = async (bannerId) => {
        const result = await setActiveBanner(bannerId);
        if (result.success) {
            toast.success('Banner set as active!');
            await loadBanners();
        } else {
            toast.error('Failed to activate banner');
        }
    };

    const handleDeactivate = async (bannerId) => {
        const result = await deactivateBanner(bannerId);
        if (result.success) {
            toast.success('Banner deactivated');
            await loadBanners();
        } else {
            toast.error('Failed to deactivate banner');
        }
    };

    const handleDelete = async (banner) => {
        if (!confirm('Delete this banner permanently?')) return;

        try {
            // Delete from Cloudinary
            if (banner.imageUrl) {
                const publicId = extractPublicId(banner.imageUrl);
                if (publicId) {
                    toast.loading('Deleting...', { id: 'delete' });
                    const cloudResult = await deleteFromCloudinary(publicId);
                    toast.dismiss('delete');
                    if (!cloudResult.success) {
                        toast.error('Failed to delete image from Cloudinary');
                        return;
                    }
                }
            }

            // Delete from Firestore
            const result = await deletePopupBanner(banner.id);
            if (result.success) {
                toast.success('Banner deleted!');
                await loadBanners();
            } else {
                toast.error(result.error || 'Failed to delete');
            }
        } catch (error) {
            toast.dismiss('delete');
            toast.error('Error deleting banner');
        }
    };

    const resetAddForm = () => {
        setShowAddForm(false);
        setNewImageFile(null);
        setNewImagePreview(null);
        setNewTitle('');
        setNewAutoClose(15);
        setNewIsActive(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const activeBanner = banners.find(b => b.isActive);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Popup Banners</h1>
                    <p className="text-gray-600 mt-2">
                        Manage up to {MAX_BANNERS} banners. Only one can be active at a time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        {banners.length} / {MAX_BANNERS}
                    </span>
                    {banners.length < MAX_BANNERS && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Banner
                        </button>
                    )}
                </div>
            </div>

            {/* Active Banner Highlight */}
            {activeBanner && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-green-500 p-2 rounded-full">
                        <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-green-800">
                            Active: {activeBanner.title || 'Untitled Banner'}
                        </p>
                        <p className="text-sm text-green-600">
                            Auto-closes in {activeBanner.autoCloseSeconds || 15}s · Shown to every new visitor
                        </p>
                    </div>
                </div>
            )}

            {/* Add Banner Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Banner</h2>

                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="e.g. Anniversary Offer, Festival Sale..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Auto-close & Active */}
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Auto-Close (sec)</label>
                                <input
                                    type="number"
                                    value={newAutoClose}
                                    onChange={(e) => setNewAutoClose(e.target.value)}
                                    min="5"
                                    max="60"
                                    className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newIsActive}
                                        onChange={(e) => setNewIsActive(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Set as active immediately</span>
                                </label>
                            </div>
                        </div>

                        {/* Image Upload */}
                        {newImagePreview && (
                            <div className="relative inline-block rounded-lg overflow-hidden border-2 border-blue-500">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={newImagePreview}
                                    alt="Preview"
                                    className="max-w-full max-h-[250px] w-auto h-auto object-contain"
                                />
                                <button
                                    onClick={() => { setNewImageFile(null); setNewImagePreview(null); }}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        )}

                        <label className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-1" />
                            <span className="text-sm text-gray-600">Click to select image</span>
                            <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddBanner}
                                disabled={uploading || !newImageFile}
                                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Check className="w-5 h-5" /> Add Banner</>
                                )}
                            </button>
                            <button
                                onClick={resetAddForm}
                                disabled={uploading}
                                className="px-6 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banners Grid */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    All Banners ({banners.length})
                </h2>

                {banners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${banner.isActive
                                        ? 'border-green-500 shadow-lg shadow-green-100'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title || 'Banner'}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Active Badge */}
                                    {banner.isActive && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3" /> ACTIVE
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {banner.title || 'Untitled Banner'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{banner.autoCloseSeconds || 15}s auto-close</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        {banner.isActive ? (
                                            <button
                                                onClick={() => handleDeactivate(banner.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                <EyeOff className="w-4 h-4" /> Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleSetActive(banner.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" /> Set Active
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(banner)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No banners yet</p>
                            <p className="text-gray-400 text-sm mt-1">Click &quot;Add Banner&quot; to create one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 p-5 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Popup Banner Guidelines:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• You can store up to <strong>{MAX_BANNERS}</strong> banners</li>
                    <li>• Only <strong>one banner</strong> can be active at a time</li>
                    <li>• Setting a banner as active automatically deactivates the previous one</li>
                    <li>• The popup shows once per visitor session</li>
                    <li>• Recommended: square (1:1) images for best display</li>
                    <li>• Maximum file size: 5MB per image</li>
                </ul>
            </div>
        </div>
    );
}
