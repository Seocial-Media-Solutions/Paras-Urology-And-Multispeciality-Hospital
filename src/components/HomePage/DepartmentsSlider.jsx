'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getDepartments } from '@/lib/firebase/departments';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Skeleton Loader Component
const DepartmentCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full animate-pulse border border-gray-200">
    {/* Image Skeleton */}
    <div className="relative h-56 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300">
      {/* Title bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-700 p-3 sm:p-4">
        <div className="h-5 sm:h-6 bg-blue-800 rounded w-2/3"></div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="p-4 sm:p-6 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      
      {/* Know More button skeleton */}
      <div className="pt-4">
        <div className="h-5 bg-blue-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

export default function DepartmentsSlider() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // For full-screen view
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const loadDepartments = async () => {
      const result = await getDepartments();
      if (result.success) {
        setDepartments(result.data);
      }
      setLoading(false);
    };
    loadDepartments();
  }, []);

  // ============================
  // CARD COMPONENT (INLINE)
  // ============================
  function DepartmentCard({ department }) {
    return (
      <div
        onClick={() => setSelectedDepartment(department)}
        className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
      >
        {/* Image - Increased height on mobile */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          {department.imageUrl ? (
            <img
              src={department.imageUrl}
              alt={department.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-200">
              <Building2 className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400" />
            </div>
          )}

          {/* Title bar at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#002b4a] p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {department.title}
            </h3>
          </div>
        </div>

        {/* Description - Increased padding on mobile */}
        <div className="p-4 sm:p-6">
          <p className="text-gray-700 leading-relaxed text-sm line-clamp-3 mb-4">
            {department.description}
          </p>

          <button className="text-green-400 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Know More
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // FULL-SCREEN MODAL
  // ============================
  const FullScreenView = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease] relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedDepartment(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1 text-sm z-10 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Image */}
        <div className="h-56 sm:h-72 w-full overflow-hidden">
          {selectedDepartment.imageUrl ? (
            <img
              src={selectedDepartment.imageUrl}
              alt={selectedDepartment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-300">
              <Building2 className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {selectedDepartment.title}
          </h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {selectedDepartment.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedDepartment && <FullScreenView />}

      <section className="py-12 sm:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002b4a] mb-4">
              Our Medical Departments
            </h2>
           
            <motion.div
              className="w-24 h-1 bg-[#002b4a] mx-auto mt-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Loading with Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <DepartmentCardSkeleton key={i} />
              ))}
            </div>
          ) : departments.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
              <Building2 className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No departments available</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
            </div>
          ) : (
            /* Slider - Better mobile spacing */
            <motion.div
              className="relative px-10 sm:px-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
              
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={departments.length > 3}
                breakpoints={{
                  640: { 
                    slidesPerView: 2,
                    spaceBetween: 30 
                  },
                  1024: { 
                    slidesPerView: 3,
                    spaceBetween: 30 
                  },
                }}
                className="departments-swiper"
              >
                {departments.map((department, i) => (
                  <SwiperSlide key={department.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    >
                      <DepartmentCard department={department} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons - Improved mobile visibility */}
              <button className="swiper-button-prev-custom absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-[#002b4a] hover:text-white transition-colors duration-300 group">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#002b4a] group-hover:text-white" />
              </button>
              <button className="swiper-button-next-custom absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-[#002b4a] hover:text-white transition-colors duration-300 group">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#002b4a] group-hover:text-white" />
              </button>

            </motion.div>
          )}
        </div>
      </section>

      {/* Pagination Styling */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s;
        }

        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: #002b4a;
        }

        .departments-swiper {
          padding-bottom: 20px;
        }

        .departments-swiper .swiper-slide {
          height: auto;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
}