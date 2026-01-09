'use client';
import React from 'react';
import Image from 'next/image';
import { Award, GraduationCap, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorsProfile() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Rajkumar Khasgiwala",
      position: "CMD OF Paras Urology and Multispeciality Hospital",
      image: "/images/dr-rajkumar1.png",
      qualifications: ["M.B.B.S.", "M.S.", "D.N.B. (Urology)"],
      specialization: "Urology & Andrology",
      experience: "20+ Years",
      surgeries: "25000+",
      description:
        "Dr. Rajkumar Khasgiwala S/o Late Sh. P.M. Khasgiwala is the Managing Director of Paras Urology and Multispeciality Hospital. He completed his M.B.B.S., M.S. from J.L.N. Medical College and earned his D.N.B. (Urology) from Sir H.N. Hospital, Mumbai in 2004.",
      expertise: [
        "Endoscopic Urology Surgeries",
        "Reconstructive Surgery",
        "Laser URS, PCNL, TURP",
        "Andrology & Infertility Treatment",
        "Dialysis Access Surgery",
      ],
      highlights: [
        "Fellowship in Urology Surgery from National University Hospital, Singapore (2006)",
        "Member of Urology Society International (USI)",
        "Published research papers in national index journals",
        "Successfully completed around 25000 urology surgeries",
      ],
    },
    {
      id: 2,
      name: "Dr. Minal Khasgiwala",
      position: "Medical Director OF Paras Urology and Multispeciality Hospital",
      image: "/images/dr-minal1.jpg",
      qualifications: ["M.B.B.S.", "M.D.", "Diploma Critical Care"],
      specialization: "Anesthesiology & Critical Care",
      experience: "20+ Years",
      surgeries: "Expert Intensivist",
      description:
        "Dr. Minal Khasgiwala graduated from R.N.T. Medical College, Udaipur in 1997 and completed her post graduation in Anesthesiology from JLN Medical College, Ajmer in 2000. She has extensive experience in treating critically ill patients.",
      expertise: [
        "Critical Care Management",
        "Anesthesiology",
        "Intensive Care Treatment",
        "CPR & Emergency Response",
        "Post Accident Care",
      ],
      highlights: [
        "Worked as intensivist at Sir H.N. Hospital, Mumbai and Jaslok Hospital",
        "Diploma in Critical Care from Jaslok Hospital Mumbai",
        "Indo Australian Diploma Critical Care",
        "Former Rotary District Chairperson of Road Safety Committee",
        "Active in conducting seminars on CPR and post-accident help",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: false }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#002b4a] mb-4">
            Meet Our Leaders
          </h2>
          <motion.div
            className="w-24 h-1 bg-[#002b4a] mx-auto mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: false }}
          />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experienced medical professionals dedicated to providing exceptional healthcare services
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="space-y-12">
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              viewport={{ once: false }}
            >
              {/* Doctor Image */}
              <div className="lg:w-2/5 relative">
                <div className="relative h-96 lg:h-full">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent"></div>

                  {/* Stats Overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: false }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">{doctor.experience}</p>
                        <p className="text-sm">Experience</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">{doctor.surgeries}</p>
                        <p className="text-sm">
                          {doctor.id === 1 ? 'Surgeries' : 'Expertise'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Doctor Info */}
              <motion.div
                className="lg:w-3/5 p-8 lg:p-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                viewport={{ once: false }}
              >
                {/* Name and Position */}
                <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-lg text-green-900 font-semibold mb-4">
                  {doctor.position}
                </p>

                {/* Qualifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.qualifications.map((qual, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {qual}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Stethoscope className="w-5 h-5 text-green-900" />
                  <span className="font-semibold text-green-900">{doctor.specialization}</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-justify">
                  {doctor.description}
                </p>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-xl font-bold text-green-900 mb-3">
                    <Award className="w-5 h-5 text-green-900" />
                    Areas of Expertise
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {doctor.expertise.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-green-900 mt-0.5 flex-shrink-0">✦</span>
                        <span className="text-gray-700 text-sm leading-relaxed">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="flex items-center gap-2 text-xl font-bold text-green-900 mb-3">
                    <GraduationCap className="w-5 h-5 text-green-900" />
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {doctor.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700 text-sm"
                      >
                        <span className="text-green-900 font-bold mt-0.5 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}