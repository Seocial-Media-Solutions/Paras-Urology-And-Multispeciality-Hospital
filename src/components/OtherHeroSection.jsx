'use client';
import React from 'react';
import Image from 'next/image'; // This is for Next.js <Image> component
import { motion } from 'framer-motion';

/**
 * A Next.js-optimized hero section component.
 * @param {object} props - The component props.
 * @param {string} props.title - The title to display in the hero section.
 * @param {string} props.imageUrl - The URL of the background image.
 * @param {string} [props.imageAlt="Hero background"] - Alt text for the background image.
 */
const OtherHeroSection = ({ title, imageUrl, imageAlt = "Hero background" }) => {
  return (
    <section className="relative w-full h-[350px] overflow-hidden font-sans">
     
      <Image
        src={imageUrl}
        alt={imageAlt}
        layout="fill"
        objectFit="cover"
        quality={75}
        priority 
        className="z-0"

        
      />
     
     
      <div className="relative z-20 h-full flex items-center">
        {/* Constrain content width and center it, matching typical page layouts */}
        <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* The blue title box, aligned to the left of the content area */}
          <motion.div 
            className="bg-[#002b4a] py-4 px-6 md:py-5 md:px-8 rounded-md shadow-lg inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
              {title}
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OtherHeroSection;