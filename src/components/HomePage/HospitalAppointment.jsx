"use client";
import React from "react";
import Image from "next/image";
import { Phone } from "lucide-react";

export default function HospitalAppointment() {
  return (
    <div className="w-full relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>

      {/* Background Image on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 opacity-30 hidden lg:block">
        <Image
          src="/images/contact-form-bg.jpg"
          alt="Hospital Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-100/20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Call to Action */}
          <div className="w-full">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Book Your Appointment at The Best Private Hospital in Ajmer
            </h1>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Phone className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Call Now to Book Your Appointment
                </h2>
                
                <a
                  href="tel:+919521894263"
                  className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-2xl sm:text-3xl hover:from-green-600 hover:to-green-700 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  +91-9521894263
                </a>
                
                <p className="text-white/80 text-lg">
                  Our team is ready to assist you 24/7
                </p>
              </div>
            </div>

            {/* <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">✓</span>
                  <span>24/7 Emergency Services Available</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">✓</span>
                  <span>Experienced Medical Professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">✓</span>
                  <span>State-of-the-Art Medical Equipment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">✓</span>
                  <span>Affordable & Quality Healthcare</span>
                </li>
              </ul>
            </div> */}
          </div>

          {/* Right Column - Google Map and Info */}
          <div className="w-full space-y-6">
            {/* Google Map */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.1680511603363!2d74.60461757488017!3d26.48253347844607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be73e8a3211ef%3A0x7ac5154a134f812e!2sDr%20Rajkumar%20Khasgiwala%20(Paras%20Urology%20And%20Multispeciality%20Hospital)%20-%20Urologist%20in%20Ajmer%2FKidney%20Stone%2FProstate%2FAndrologist!5e0!3m2!1sen!2sin!4v1762839093967!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Hospital Info */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Best Multi Speciality Hospital in Ajmer, Rajasthan
              </h2>

              <ul className="space-y-3 text-white text-justify">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">●</span>
                  <span className="text-sm sm:text-base">
                    Empanelled with Mukhyamantri Ayushman Arogya Yojana (MAA),
                    Chiranjeevi Swasthya Bima Yojana, RGHS, ESIC, CGHS, ECHS,
                    Railways
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">●</span>
                  <span className="text-sm sm:text-base">
                    Cashless treatment for selected government & private schemes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">●</span>
                  <span className="text-sm sm:text-base">
                    Latest technology and state-of-the-art infrastructure
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 mt-1">●</span>
                  <span className="text-sm sm:text-base">
                    Affordable treatment & personalized care
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}