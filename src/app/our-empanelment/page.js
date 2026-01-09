'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Building2, Users, ZoomIn, X } from 'lucide-react';
import { getEmpanelments } from '@/lib/firebase/empanelments';
import OtherHeroSection from '@/components/OtherHeroSection';

// ─────────────────────────────────────────────
// Skeleton Components
// ─────────────────────────────────────────────
const EmpanelmentCardSkeleton = () => (
  <div className="group border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
    <div className="aspect-square flex items-center justify-center bg-gray-200 rounded"></div>
    <div className="mt-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div>
    <div className="h-9 bg-gray-300 rounded w-96 mb-8 animate-pulse"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {[...Array(12)].map((_, index) => (
        <EmpanelmentCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay },
  }),
};

const gridItem = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default function EmpanelmentsPage() {
  const [empanelments, setEmpanelments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    loadEmpanelments();
  }, []);

  const loadEmpanelments = async () => {
    setLoading(true);
    const result = await getEmpanelments();
    if (result.success) setEmpanelments(result.data);
    else console.error('Failed to load empanelments:', result.error);
    setLoading(false);
  };

  const getCategoryEmpanelments = (category) =>
    empanelments.filter((item) => item.category === category);

  const categories = [
    { id: 'government', title: 'Government Insurance Companies and TPAs', icon: Shield },
    { id: 'private', title: 'Private Insurance Companies', icon: Building2 },
    { id: 'corporate', title: 'Corporate Empanelments', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
     
        <OtherHeroSection title="Our Empanelments" imageUrl="/images/hero.jpg" />
    

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="space-y-16">{categories.map((c) => <CategorySkeleton key={c.id} />)}</div>
        ) : empanelments.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-white rounded-xl shadow-md"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No empanelments available</p>
            <p className="text-gray-400 mt-2">Please check back later</p>
          </motion.div>
        ) : (
          <div className="space-y-20">
            {categories.map((category) => {
              const items = getCategoryEmpanelments(category.id);
              if (items.length === 0) return null;

              return (
                <motion.div
                  key={category.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">{category.title}</h2>

                  {/* Logo Grid */}
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                      },
                    }}
                  >
                    {items.map((item) => (
                      <motion.div key={item.id} variants={gridItem}>
                        <div
                          className="group border border-gray-200 rounded-lg p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white relative"
                          title={item.name}
                          onClick={() =>
                            setLightboxImage({ url: item.imageUrl, name: item.name })
                          }
                        >
                          <div className="aspect-square flex items-center justify-center cursor-pointer">
                            {item.imageUrl ? (
                              <>
                                <motion.img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                  initial={{ opacity: 0, scale: 1.05 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImage({
                                      url: item.imageUrl,
                                      name: item.name,
                                    });
                                  }}
                                  className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                                  title="View full size"
                                >
                                  <ZoomIn className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <svg
                                className="w-16 h-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-center mt-3 text-gray-700 font-medium line-clamp-2">
                            {item.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
            
            {/* Additional text line at the end */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center py-8"
            >
              <p className="text-4xl font-bold text-gray-800">
                And all other leading TPAs and Health Insurances
              </p>
            </motion.div>
          </div>
        )}

        
      </div>

   
      {/* Lightbox Modal */}
      {lightboxImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <motion.div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <p className="text-white text-lg mt-4 text-center">{lightboxImage.name}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}