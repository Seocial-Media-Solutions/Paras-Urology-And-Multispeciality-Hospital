'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DirectorSection() {
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
      className="grid grid-cols-1 lg:grid-cols-2 bg-[#002b4a]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      
      {/* Left Side - Director Image */}
      <motion.div 
        className="relative min-h-[450px] lg:min-h-[600px] flex items-center justify-center p-8 lg:p-12"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative w-full h-full max-w-md mx-auto">
          <Image
            src="/images/dr-rajkumar.png"
            alt="Dr. Rajkumar Khasgiwala"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </motion.div>

      {/* Right Side - Content */}
      <motion.div 
        className="min-h-[500px] lg:min-h-[600px] flex items-center p-8 md:p-12 lg:p-16"
        variants={containerVariants}
      >
        <div className="max-w-3xl">
          
          {/* Title */}
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-white text-lg md:text-xl font-light mb-2 pb-2 border-b-2 border-white inline-block"
              variants={itemVariants}
            >
              Chairman & Managing Director
            </motion.h3>
          </motion.div>

          {/* Director Name */}
          <motion.h2 
            className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
            variants={itemVariants}
          >
            Dr. Rajkumar Khasgiwala
          </motion.h2>

          {/* Tagline */}
          <motion.h3 
            className="text-white text-2xl md:text-3xl font-semibold mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Pioneering Excellence in Urological Care
          </motion.h3>

          {/* Description */}
          <motion.div 
            className="text-white text-base md:text-lg leading-relaxed space-y-4 text-justify"
            variants={itemVariants}
          >
            <motion.p variants={itemVariants}>
              Dr. Rajkumar Khasgiwala, Managing Director of Paras Urology and Multispeciality Hospital, brings over two decades of expertise in urological and andrological care. A resident of Ajmer, Dr. Khasgiwala completed his M.B.B.S. and M.S. from J.L.N Medical College before earning his D.N.B. (Urology) from Sir H.N. Hospital, Mumbai in 2004.
            </motion.p>
            <motion.p variants={itemVariants}>
              After establishing a successful private practice in South Mumbai, he was awarded a fellowship in urology surgery from National University Hospital, Singapore in 2006. Since then, he has become a leading figure in the field of endoscopic urology surgeries, with expertise spanning Endo urology, Laser URS, PCNL, TURP, PCCL, and PCN procedures.
            </motion.p>
            <motion.p variants={itemVariants}>
              Dr. Khasgiwala specializes in managing kidney stones, prostate enlargement, urinary tract diseases, and reconstructive urology for congenital urological abnormalities. He also practices andrology for sexual and infertility problems, and performs complex procedures including dialysis access surgery, CAPD Catheter insertion, and AV fistula formation.
            </motion.p>
            <motion.p 
              className="font-semibold"
              variants={itemVariants}
            >
              With over 25,000 successful urology surgeries completed in the last 20 years, Dr. Khasgiwala continues to set new standards in urological care, making Paras Hospital a center of excellence in the region.
            </motion.p>
          </motion.div>

        </div>
      </motion.div>

    </motion.section>
  );
}