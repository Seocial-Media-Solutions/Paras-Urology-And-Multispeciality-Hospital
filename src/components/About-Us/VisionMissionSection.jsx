'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VisionMissionSection() {
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
      className="relative py-16 px-4 md:px-8 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hospital-about.jpg"
          alt="Hospital Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* White Overlay */}
      <div className="absolute inset-0 bg-white/70 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
        >
          
          {/* Left Side - Vision, Mission, Quality Policy & Values */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            
            {/* Our Vision */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <motion.p 
                className="text-gray-700 leading-relaxed text-justify"
                variants={itemVariants}
              >
                To promote & provide modern, cost effective medical and health facilities in the field of Urology & Nephrology.
              </motion.p>
            </motion.div>

            {/* Our Mission */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <motion.p 
                className="text-gray-700 leading-relaxed text-justify"
                variants={itemVariants}
              >
                To establish a Healthy Society, where no one remains ill & ignorant about disease hence leading to economic growth of the society.
              </motion.p>
            </motion.div>

            {/* Quality Policy */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quality Policy
              </h2>
              <motion.p 
                className="text-gray-700 leading-relaxed text-justify"
                variants={itemVariants}
              >
                Organization quality is based on the belief that people should be educated to lead a healthy lifestyle and take regular medical checkups to treat any upcoming diseases to avoid loss of man hours due to hospitalization and hold the disease in treatable stage.
              </motion.p>
            </motion.div>

            {/* Our Values */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <motion.ul className="space-y-4" variants={itemVariants}>
                <motion.li 
                  className="flex gap-3"
                  variants={itemVariants}
                >
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <span className="font-bold text-gray-900">Timeliness of care</span>
                  </div>
                </motion.li>
                <motion.li 
                  className="flex gap-3"
                  variants={itemVariants}
                >
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <span className="font-bold text-gray-900">Openness in communication</span>
                  </div>
                </motion.li>
                <motion.li 
                  className="flex gap-3"
                  variants={itemVariants}
                >
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <span className="font-bold text-gray-900">Transparency and ethical delivery of care</span>
                  </div>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Book Appointment Button */}
            <motion.div variants={itemVariants}>
              <Link href="/book-appointment">
              <motion.button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Appointment
              </motion.button>
              </Link>
            </motion.div>

          </motion.div>

          {/* Right Side - Image Collage */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {/* Top Left - Billing Counter */}
              <motion.div 
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="/images/billing-counter.jpg"
                  alt="Billing Counter"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Top Right - General Ward */}
              <motion.div 
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="/images/general-ward.jpg"
                  alt="General Ward"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bottom Left - Medical Equipment */}
              <motion.div 
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="/images/medical-equipments.jpg"
                  alt="Medical Equipment"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bottom Right - Hospital Building */}
              <motion.div 
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="/images/hospital-about.jpg"
                  alt="Hospital Building"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}