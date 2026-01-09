'use client';
import Image from 'next/image';
import { UserCheck, Wrench, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUsSection() {
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
    <motion.section 
      className="py-16 px-4 md:px-8 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
        >
          
          {/* Left Side - Image */}
          <motion.div
            className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/images/hospital-img.png"
              alt="hospital image"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                variants={itemVariants}
              >
                About Paras Urology & Multispeciality Hospital
              </motion.h2>
              <motion.div 
                className="w-20 h-1 bg-[#002b4a]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>

            {/* Description */}
            <motion.div 
              className="space-y-4 text-gray-700 leading-relaxed text-justify"
              variants={itemVariants}
            >
              <motion.p variants={itemVariants}>
                We are committed to provide high-quality medical services in the field of different branches of medicine. We focus on prompt diagnosis, standardized medical care with advanced medical technology, and efficient staff leading to a happy and healthy discharge to home.
              </motion.p>
              <motion.p variants={itemVariants}>
                PUMH is an offshoot of Raj Uro Care Centre, which has a successful track record of over 20,000 urological procedures under the able guidance of Dr. Rajkumar Khasgiwala. Our motto is to provide quality health care services as a Multispeciality Hospital with all leading branches of medicine like Urology, Nephrology, General Surgery, Laparoscopic & Laser Surgery, General Medicine, Orthopedics, Gynecology, Pediatrics, Neuro Surgery, Oncology, Dietetics & Physiotherapy.
              </motion.p>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={containerVariants}
            >
              
              {/* Qualified Medical Team */}
              <motion.div 
                className="flex gap-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Qualified Medical Team
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our expert team is led by experienced professionals dedicated to providing exceptional patient care across multiple specialties.
                  </p>
                </div>
              </motion.div>

              {/* World Class Facilities */}
              <motion.div 
                className="flex gap-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center">
                    <Wrench className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Advanced Medical Technology
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our state-of-the-art facilities with advanced medical technology ensure prompt diagnosis and standardized care.
                  </p>
                </div>
              </motion.div>

            </motion.div>

            {/* Emergency Call Banner */}
            <motion.div 
              className="bg-green-600 rounded-lg overflow-hidden shadow-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side */}
                <div className="flex items-center justify-center gap-3 p-6 bg-green-700">
                  <Phone className="w-6 h-6 text-white" />
                  <span className="text-white text-lg font-semibold">
                    Any Emergency? Call Now!
                  </span>
                </div>
                
                {/* Right Side */}
                <div className="flex items-center justify-center p-6 bg-green-600">
                  <motion.a 
                    href="tel:+919521894263"
                    className="text-white text-2xl font-bold hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +91-95218-94263
                  </motion.a>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}