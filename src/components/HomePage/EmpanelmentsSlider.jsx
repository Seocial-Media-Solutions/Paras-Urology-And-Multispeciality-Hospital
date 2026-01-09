'use client';
import { useState, useEffect } from 'react';
import { Shield, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getEmpanelments } from '@/lib/firebase/empanelments';

export default function EmpanelmentsSlider() {
  const [empanelments, setEmpanelments] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    loadEmpanelments();
  }, []);

  const loadEmpanelments = async () => {
    const result = await getEmpanelments();
    if (result.success) {
      setEmpanelments(result.data);
    } else {
      console.error('Failed to load empanelments:', result.error);
    }
  };

  if (empanelments.length === 0) {
    return null; // Return nothing if no empanelments
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#002b4a] mb-6 md:mb-10 text-center">
          Our Empanelments
         <div className="w-24 h-1 bg-[#002b4a] mx-auto mt-2"></div>
        </h2>

        {/* Slider Container */}
        <div className="relative bg-white rounded-xl shadow-lg p-4 md:p-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={15}
            slidesPerView={2}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={empanelments.length > 6}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
            }}
            className="empanelments-swiper"
          >
            {empanelments.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="group border-2 border-gray-200 rounded-lg p-3 md:p-4 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-white h-full relative">
                  <div 
                    className="aspect-square flex items-center justify-center mb-2 md:mb-3 cursor-pointer"
                    onClick={() => setLightboxImage({ url: item.imageUrl, name: item.name })}
                  >
                    {item.imageUrl ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/200x200/F0F0F0/AAAAAA?text=No+Image`;
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage({ url: item.imageUrl, name: item.name });
                          }}
                          className="absolute top-1 right-1 md:top-2 md:right-2 bg-blue-600 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                          title="View full size"
                        >
                          <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </>
                    ) : (
                      <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-[10px] md:text-xs text-center text-gray-700 font-medium line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                    {item.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-[#002b4a] text-white p-1.5 md:p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button className="swiper-button-next-custom absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-[#002b4a] text-white p-1.5 md:p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-lg mt-4 text-center px-4">{lightboxImage.name}</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .empanelments-swiper {
          padding: 15px 40px;
        }
        
        @media (max-width: 768px) {
          .empanelments-swiper {
            padding: 10px 30px;
          }
        }
      `}</style>
    </div>
  );
}