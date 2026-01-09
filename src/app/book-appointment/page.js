'use client';

import DepartmentsSlider from '@/components/HomePage/DepartmentsSlider';
import OtherHeroSection from '@/components/OtherHeroSection';
import {  Clock, Phone, Stethoscope, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';



export default function BookConsultationPage() {
  const handleCall = () => {
    window.location.href = "tel:+919521894263";
  };

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

  return (
    <>
   <OtherHeroSection title="Book Appointment" imageUrl="/images/hero5.jpg" />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div 
        className="bg-[#002b4a] text-white py-12 md:py-20 m-20 rounded-3xl "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 m">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Book Your Consultation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 md:mb-8 px-2">
              Expert Medical Care is Just a Phone Call Away
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
              <p className="text-base md:text-lg mb-4 md:mb-6">Call us now to schedule your appointment</p>
              <motion.button 
                onClick={handleCall}
                className="bg-white text-blue-600 px-6 sm:px-8 md:px-12 py-4 md:py-5 rounded-full text-lg sm:text-xl md:text-2xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📞 +91-95218-94263
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Why Choose Us Section */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4"
              variants={itemVariants}
            >
              Why Choose Us?
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4"
              variants={itemVariants}
            >
              We provide comprehensive healthcare services with experienced medical professionals dedicated to your wellbeing
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Expert Doctors</h3>
              <p className="text-sm md:text-base text-gray-600">
                Highly qualified and experienced medical professionals across all specialties
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Personalized Care</h3>
              <p className="text-sm md:text-base text-gray-600">
                Individualized treatment plans tailored to your specific health needs
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all sm:col-span-2 md:col-span-1"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Quality Assurance</h3>
              <p className="text-sm md:text-base text-gray-600">
                State-of-the-art facilities with the highest standards of medical care
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            className="bg-[#002b4a] rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-white mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                Ready to Book Your Consultation?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-2">
                Our friendly staff is available to help you schedule an appointment at your convenience
              </p>
              
              <motion.button 
                onClick={handleCall}
                className="bg-white text-blue-600 px-6 sm:px-8 md:px-12 py-4 md:py-5 rounded-full text-lg sm:text-xl md:text-2xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Call Now: +91-95218-94263
              </motion.button>
              <p className="text-sm md:text-base text-blue-200 mt-4 md:mt-6">
                Available Monday to Saturday, 9:00 AM - 6:00 PM
              </p>
            </div>
          </motion.div>

          {/* Information Cards */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
          >
            {/* 24/7 Availability */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Availability</h3>
              </div>
              <div className="space-y-4">
                <div className="text-center py-6 md:py-8">
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full mb-3 md:mb-4">
                    <span className="text-2xl md:text-3xl font-bold">24/7</span>
                  </div>
                  <p className="text-gray-600 text-base md:text-lg font-medium">Open All Day, Every Day</p>
                  <p className="text-sm md:text-base text-gray-500 mt-2">We're here for you around the clock</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Contact Information</h3>
              </div>
              <div className="space-y-4 md:space-y-5">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs md:text-sm text-gray-500 mb-2">Appointments & Emergencies</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 break-all">+91-95218-94263</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs md:text-sm text-gray-500 mb-2">Email</p>
                  <a 
                    href="mailto:parasurologyhospital@gmail.com" 
                    className="text-sm md:text-lg font-semibold text-blue-600 hover:text-blue-700 break-all"
                  >
                    parasurologyhospital@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Departments Section */}
          <DepartmentsSlider/>

          {/* Emergency Section */}
          <motion.div
            className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-3 md:mb-4">
                24/7 Emergency Services
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-red-100 mb-4 md:mb-6 px-2">
                For medical emergencies, call us immediately or visit our emergency department
              </p>
              <motion.button 
                onClick={handleCall}
                className="bg-white text-red-600 px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold hover:bg-red-50 transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Emergency: +91-95218-94263
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div 
        className="bg-gray-50 py-12 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div 
              className="grid sm:grid-cols-2 gap-4 md:gap-6"
              variants={containerVariants}
            >
              {[
                {
                  q: "How do I book a consultation?",
                  a: "Simply call us at +91-95218-94263 and our staff will help you schedule an appointment at your preferred time."
                },
                {
                  q: "Can I choose my doctor?",
                  a: "Yes, you can request a specific doctor when booking. We'll do our best to accommodate your preference."
                },
                {
                  q: "What should I bring to my appointment?",
                  a: "Please bring your ID, insurance card, and any relevant medical records or test results."
                },
                {
                  q: "Do you accept walk-ins?",
                  a: "While we accept walk-ins, scheduled appointments are prioritized. We recommend calling ahead to ensure availability."
                },
                {
                  q: "How far in advance should I book?",
                  a: "We recommend booking at least 1-2 weeks in advance for routine appointments, but we can often accommodate urgent requests."
                },
                {
                  q: "Can I reschedule my appointment?",
                  a: "Yes, please call us at least 24 hours before your scheduled appointment to reschedule without any charges."
                }
              ].map((faq, idx) => (
                <motion.div 
                  key={idx} 
                  className="bg-white rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-bold text-gray-800 mb-2 md:mb-3 text-base md:text-lg">{faq.q}</h3>
                  <p className="text-sm md:text-base text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        className="bg-white py-12 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              Don't Wait - Book Your Consultation Today
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">
              Take the first step towards better health. Our medical team is ready to assist you.
            </p>
            <motion.button 
              onClick={handleCall}
              className="bg-[#002b4a] text-white px-6 sm:px-8 md:px-12 py-4 md:py-5 rounded-full text-lg sm:text-xl md:text-2xl font-bold hover:bg-[#003d66] transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📞 Call +91-95218-94263
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
}