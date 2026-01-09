'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  User,
  Clock,
  Award,
  BookOpen,
  Loader2,
  ArrowLeft,
  Calendar,
  Phone,
} from 'lucide-react';
import { getDoctorBySlug } from '@/lib/firebase/doctors';
import Link from 'next/link';

export default function SingleDoctorPage() {
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.slug) {
      loadDoctor(params.slug);
    }
  }, [params.slug]);

  const loadDoctor = async (slug) => {
    setLoading(true);
    setNotFound(false);
    const result = await getDoctorBySlug(slug);
    if (result.success) setDoctor(result.data);
    else setNotFound(true);
    setLoading(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !doctor) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white"
      >
        <User className="w-20 h-20 text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Doctor Not Found
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          The doctor you're looking for doesn't exist or has been removed
        </p>
        <Link
          href="/doctors"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Doctors
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-green-50 to-white"
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        className="bg-[#002b4a] text-white py-8"
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-2 pt-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to All Doctors</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#002b4a] rounded-xl p-6 text-white sticky top-8">
                <motion.div
                  className="bg-white rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {doctor.imageUrl ? (
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-24 h-24 text-green-400" />
                    </div>
                  )}
                </motion.div>

                <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-green-200 mb-6 text-lg">{doctor.education}</p>

                <motion.div
                  className="bg-blue-700 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-semibold">OPD Timing</h3>
                  </div>
                  <p className="text-sm text-green-100">{doctor.timing}</p>
                </motion.div>

                <div className="space-y-3">
                  <Link href={"/book-appointment"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </motion.button>
                  </Link>

                  <Link href={"tel:+919521894263"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 inline-block pb-2">
                  About Doctor
                </h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Education
                      </p>
                      <p className="font-semibold text-gray-800">{doctor.education}</p>
                    </div>
                 
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        Experience
                      </p>
                      <p className="font-semibold text-gray-800">{doctor.experience}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        Expertise
                      </p>
                      <p className="font-semibold text-gray-800">{doctor.expertise}</p>
                    </div>
                  </div>

                  <motion.div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 mb-2 text-lg">
                          Achievements & Recognition
                        </p>
                        <p className="text-gray-700 leading-relaxed">{doctor.achievements}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Biography */}
              {doctor.about && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 inline-block pb-2">
                    Brief About Doctor
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                      {doctor.about}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Memberships */}
              {doctor.memberships?.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 inline-block pb-2">
                    Memberships
                  </h2>
                  <div className="bg-gradient-to-br from-green-50 to-indigo-50 rounded-lg p-6">
                    <ul className="space-y-3">
                      {doctor.memberships.map((membership, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="bg-green-600 rounded-full p-1.5 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-gray-700 flex-1">{membership}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                className="bg-[#002b4a] text-white rounded-xl p-8"
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Book an Appointment?
                </h3>
                <p className="mb-6 text-blue-100 text-lg">
                  Get expert medical care from {doctor.name}. Our team is here to help you schedule your consultation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href={"/book-appointment"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </motion.button>
                  </Link>
                   <Link href={"tel:+919521894263"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Contact Hospital
                  </motion.button>
                  </Link>
                </div>
              </motion.div>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Doctors
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
