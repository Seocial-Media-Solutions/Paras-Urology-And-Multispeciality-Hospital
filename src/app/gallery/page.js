'use client';
import { useState, useEffect } from 'react';
import { X, ZoomIn, Calendar, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { getGalleries } from '@/lib/firebase/galleries';
import OtherHeroSection from '@/components/OtherHeroSection';

// Skeleton Components
const GalleryImageSkeleton = () => (
  <div className="break-inside-avoid">
    <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
  </div>
);

const GalleryCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-3 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>
    <div className="p-6">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {[...Array(8)].map((_, index) => (
          <GalleryImageSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

const TabContentSkeleton = () => (
  <div className="space-y-12">
    {[...Array(2)].map((_, index) => (
      <GalleryCardSkeleton key={index} />
    ))}
  </div>
);

export default function GalleryPublicPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  useEffect(() => {
    loadGalleries();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, lightboxIndex, lightboxImages]);

  const loadGalleries = async () => {
    setLoading(true);
    const result = await getGalleries();
    if (result.success) {
      setGalleries(result.data);
    }
    setLoading(false);
  };

  const openLightbox = (images, index, title) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setGalleryTitle(title);
    const img = images[index];
    setLightboxImage({
      url: img.url,
      name: img.name || '',
      description: img.description || ''
    });
  };

  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % lightboxImages.length;
    setLightboxIndex(newIndex);
    const img = lightboxImages[newIndex];
    setLightboxImage({
      url: img.url,
      name: img.name || '',
      description: img.description || ''
    });
  };

  const prevImage = () => {
    const newIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    setLightboxIndex(newIndex);
    const img = lightboxImages[newIndex];
    setLightboxImage({
      url: img.url,
      name: img.name || '',
      description: img.description || ''
    });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxImages([]);
    setLightboxIndex(0);
    setGalleryTitle('');
  };

  const getTypeGalleries = (type) => {
    return galleries.filter(item => item.type === type);
  };

  // Get display title for lightbox
  const getLightboxTitle = () => {
    if (lightboxImage?.name) return lightboxImage.name;
    return `${galleryTitle} - Image ${lightboxIndex + 1}`;
  };

  const tabs = [
    { id: 'events', name: 'Events Gallery', icon: Calendar },
    { id: 'newspaper', name: 'Newspaper Media', icon: Newspaper }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <OtherHeroSection title={'Gallery'} imageUrl={'/images/hero3.jpg'} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const count = loading ? 0 : getTypeGalleries(tab.id).length;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={loading}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name} {!loading && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <TabContentSkeleton />
        ) : (
          tabs.map((tab) => {
            if (activeTab !== tab.id) return null;
            
            const items = getTypeGalleries(tab.id);
            
            return (
              <div key={tab.id}>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl shadow-md">
                    <tab.icon className="w-20 h-20 text-gray-300 mb-4" />
                    <p className="text-xl">No galleries available yet</p>
                    <p className="text-sm mt-2">Check back soon for updates</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {item.title}
                          </h2>
                          {item.description && (
                            <p className="text-gray-600 mb-3">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </div>
                        
                        {item.images && item.images.length > 0 && (
                          <div className="p-6">
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                              {item.images.map((image, imgIndex) => (
                                <div 
                                  key={imgIndex} 
                                  className="break-inside-avoid cursor-pointer"
                                  onClick={() => openLightbox(item.images, imgIndex, item.title)}
                                >
                                  {/* Image container */}
                                  <div className="relative group">
                                    <img
                                      src={image.url}
                                      alt={image.name || `${item.title} - ${imgIndex + 1}`}
                                      className={`w-full hover:opacity-90 transition-opacity ${(image.name || image.description) ? 'rounded-t-lg' : 'rounded-lg'}`}
                                      loading="lazy"
                                    />
                                    {/* Hover overlay with zoom icon */}
                                    <div className={`absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center ${(image.name || image.description) ? 'rounded-t-lg' : 'rounded-lg'}`}>
                                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                  {/* Image name and description - always visible below image */}
                                  {(image.name || image.description) && (
                                    <div className="bg-gray-100 p-3 rounded-b-lg border border-t-0 border-gray-200">
                                      {image.name && (
                                        <p className="text-gray-800 text-sm font-semibold">{image.name}</p>
                                      )}
                                      {image.description && (
                                        <p className="text-gray-600 text-xs mt-1 line-clamp-3">{image.description}</p>
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
          })
        )}
      </div>

      {/* Lightbox Modal with Navigation */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image Counter */}
          {lightboxImages.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full z-10">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}

          {/* Image and Info Container */}
          <div 
            className="max-w-7xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={getLightboxTitle()}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Image Title and Description */}
            <div className="mt-4 text-center max-w-3xl px-4">
              <p className="text-white text-xl font-semibold">
                {getLightboxTitle()}
              </p>
              {lightboxImage.description && (
                <p className="text-gray-300 text-base mt-2 leading-relaxed">
                  {lightboxImage.description}
                </p>
              )}
              {/* Show gallery name if image has custom name */}
              {lightboxImage.name && (
                <p className="text-gray-400 text-sm mt-3">
                  From: {galleryTitle}
                </p>
              )}
            </div>
          </div>

          {/* Keyboard Navigation Hint */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              Use arrow keys to navigate • Press ESC to close
            </div>
          )}
        </div>
      )}
    </div>
  );
}