'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OtherHeroSection from "@/components/OtherHeroSection";
import { getDepartments } from '@/lib/firebase/departments';
import { Loader2, Building2, Stethoscope, Heart, Users, ArrowRight } from 'lucide-react';

// Skeleton Loader Component
const DepartmentCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
      {/* Title bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-700 p-4">
        <div className="h-6 bg-blue-800 rounded w-2/3"></div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="p-6 space-y-3">
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

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // For full-screen view
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

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

  // icon rotation
  const getIcon = (index) => {
    const icons = [Stethoscope, Heart, Users, Building2];
    const Icon = icons[index % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  // Truncate description to show preview
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // ============================
  // CARD COMPONENT (INLINE)
  // ============================
  function DepartmentCard({ department, index }) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        {/* Image with title overlay */}
        <div className="relative h-64 overflow-hidden">
          {department.imageUrl ? (
            <img
              src={department.imageUrl}
              alt={department.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-200">
              <Building2 className="w-20 h-20 text-blue-400" />
            </div>
          )}

          {/* Dark overlay for title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-blue-700 p-4">
            <h3 className="text-xl font-bold text-white">
              {department.title}
            </h3>
          </div>
        </div>

        {/* Description Content */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {truncateText(department.description, 150)}
          </p>

          {/* Know More Button */}
          <button
            onClick={() => setSelectedDepartment(department)}
            className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group"
          >
            Know More
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // FULL-SCREEN MODAL
  // ============================
  const FullScreenView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative my-8"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedDepartment(null)}
          className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-lg z-10"
        >
          ✕
        </button>

        {/* Image */}
        <div className="h-72 w-full overflow-hidden">
          {selectedDepartment.imageUrl ? (
            <img
              src={selectedDepartment.imageUrl}
              alt={selectedDepartment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-300">
              <Building2 className="w-20 h-20 text-blue-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedDepartment.title}
          </h2>

          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {selectedDepartment.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {selectedDepartment && <FullScreenView />}

      <OtherHeroSection title="Our Departments" imageUrl="/images/hero1.jpg" />

      <motion.section 
        className="py-16 px-4 md:px-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              variants={itemVariants}
            >
              <Building2 className="w-8 h-8 text-blue-600" />
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              variants={itemVariants}
            >
              Our Medical Departments
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Expert care across multiple specialties with state-of-the-art
              facilities and experienced medical professionals.
            </motion.p>
          </motion.div>

          {/* Loading with Skeleton */}
          {loading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                >
                  <DepartmentCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : departments.length === 0 ? (
            /* Empty */
            <motion.div 
              className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg"
              variants={itemVariants}
            >
              <Building2 className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No departments available</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
            </motion.div>
          ) : (
            /* Grid - 4 columns to match the image layout */
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {departments.map((department, index) => (
                <motion.div
                  key={department.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <DepartmentCard
                    department={department}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </>
  );
}