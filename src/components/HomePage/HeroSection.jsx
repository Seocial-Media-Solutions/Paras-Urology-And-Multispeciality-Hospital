'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { getHeroData } from '../../lib/firebase/firestore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      const result = await getHeroData();
      if (result.success && result.data?.imageUrls && Array.isArray(result.data.imageUrls)) {
        setHeroImages(result.data.imageUrls);
      } else if (result.success && result.data?.imageUrl) {
        // Backward compatibility: convert single image to array
        setHeroImages([result.data.imageUrl]);
      }
    } catch (error) {
      console.error('Error loading hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative h-[35vh] min-h-[250px] md:h-[70vh] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 animate-pulse"></div>
      </section>
    );
  }

  if (!heroImages || heroImages.length === 0) {
    return (
      <section className="relative h-[35vh] min-h-[200px] md:h-[70vh] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Welcome to Paras Hospital</h1>
          <p className="text-base md:text-xl">Compassionate Care, Advanced Medicine</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[20vh] min-h-[180px] md:h-[70vh] md:min-h-[550px] sm:mt-6 md:mt-6 ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={heroImages.length > 1}
        className="w-full h-full"
      >
        {heroImages.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={imageUrl}
                alt={`Paras Hospital ${index + 1}`}
                className="w-full h-full object-fit object-center"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%233b82f6" width="100" height="100"/%3E%3C/svg%3E';
                }}
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 50px;
            height: 50px;
          }
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
        }

        @media (min-width: 768px) {
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 20px;
          }
        }

        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }

        .swiper-pagination {
          bottom: 15px !important;
        }

        @media (min-width: 768px) {
          .swiper-pagination {
            bottom: 30px !important;
          }
        }
      `}</style>
    </section>
  );
}