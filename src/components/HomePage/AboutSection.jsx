'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Simulate Next.js Link and Image components
const Link = ({ href, children, className = '' }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

const Image = ({ src, alt, width, height, className = '' }) => (
  <img src={src} alt={alt} width={width} height={height} className={className} />
);

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            className="bg-white border-2 border-blue-200 rounded-lg p-8 lg:p-12"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: false }}
          >
            <h3 className="text-gray-800 text-xl font-bold mb-4 uppercase tracking-wide">
              About Our Hospital
            </h3>
            
            <motion.h2
              className="text-green-600 text-3xl lg:text-4xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: false }}
            >
              Paras Urology & Multispeciality Hospital
            </motion.h2>

            <motion.div
              className="text-gray-700 leading-relaxed text-justify"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              viewport={{ once: false }}
            >
              <p className="mb-4">
                We are committed to provide high-quality medical services in the field of different branches of medicine. We focus on prompt diagnosis, standardized medical care with advanced medical technology, and efficient staff leading to a happy and healthy discharge to home.
              </p>
              
              <p>
                PUMH is an offshoot of Raj Uro Care Centre, which has a successful track record of over 20,000 urological procedures under the able guidance of Dr. Rajkumar Khasgiwala. Our motto is to provide quality health care services as a Multispeciality Hospital with all leading branches of medicine like Urology, Nephrology, General Surgery, Laparoscopic & Laser Surgery, General Medicine, Orthopedics, Gynecology, Pediatrics, Neuro Surgery, Oncology, Dietetics, Dentistry & Physiotherapy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: false }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-700 font-semibold mt-8 hover:gap-3 transition-all duration-300 group"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  Know More
                </motion.span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: false }}
          >
            <Image
              src="/images/hospital-about.png"
              alt="Hospital Overview"
              width={600}
              height={700}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;