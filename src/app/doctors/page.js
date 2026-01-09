'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Award, BookOpen, ArrowRight } from 'lucide-react';
import { getDoctors } from '@/lib/firebase/doctors';
import Link from 'next/link';
import OtherHeroSection from '@/components/OtherHeroSection';

// Skeleton Loader
const DoctorCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full animate-pulse">
    <div className="relative w-full" style={{ paddingBottom: '125%' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default function AllDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const result = await getDoctors();
    if (result.success) setDoctors(result.data);
    else console.error('Failed to load doctors:', result.error);
    setLoading(false);
  };

  // Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, delay, ease: 'easeInOut' },
    }),
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      initial="hidden"
      animate="show"
    >
      
        <OtherHeroSection title={'Our Doctors'} imageUrl={'/images/hero2.jpg'} />
      

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(6)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={0.3}
          >
            <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No doctors available</p>
            <p className="text-gray-400 mt-2">Please check back later</p>
          </motion.div>
        ) : (
          <>
            {/* Section Title */}
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              custom={0.3}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Expert Medical Professionals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our doctors bring years of experience and expertise to ensure you receive the best possible care.
              </p>
            </motion.div>

            {/* Cards Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    delay: index * 0.1 + 1.5, // 👈 delay for “after appear” scroll effect
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <Link href={`/doctors/${doctor.slug}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                      {/* Image */}
                      <div
                        className="relative w-full bg-gradient-to-br from-blue-100 to-blue-200"
                        style={{ paddingBottom: '125%' }}
                      >
                        {doctor.imageUrl ? (
                          <motion.img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ scale: 1.05, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            viewport={{ once: true }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <User className="w-24 h-24 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-2xl font-bold text-white">{doctor.name}</h3>
                          <p className="text-blue-200">{doctor.education}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="space-y-3 mb-4 flex-1">
                          
                          <div className="flex items-start gap-2">
                            <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">Experience</p>
                              <p className="font-medium text-gray-800">{doctor.experience}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">Expertise</p>
                              <p className="font-medium text-gray-800 line-clamp-2">{doctor.expertise}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-green-600 font-semibold group">
                            <span>View Full Profile</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* CTA Section */}
      {!loading && doctors.length > 0 && (
        <motion.div
          className="bg-green-600 text-white py-16 mt-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          custom={0.4}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need to Book an Appointment?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our friendly staff is ready to help you schedule a consultation with any of our expert doctors.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/book-appointment">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Book Appointment
              </button>
              </Link>
               <Link href={"tel:+919521894263"}>
              <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Contact Us
              </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
