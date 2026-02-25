import AboutSection from "@/components/HomePage/AboutSection";
import DepartmentsSlider from "@/components/HomePage/DepartmentsSlider";
import DoctorsSlider from "@/components/HomePage/DoctorSlider";
import DoctorsProfile from "@/components/HomePage/DoctorsProfile";
import ElfsightWidget from "@/components/HomePage/ElfsightWidget";
import EmpanelmentsSlider from "@/components/HomePage/EmpanelmentsSlider";
import GallerySlider from "@/components/HomePage/GallerySlider";
import HeroSection from "@/components/HomePage/HeroSection";
import HospitalAppointment from "@/components/HomePage/HospitalAppointment";
import StatsSection from "@/components/HomePage/StatsSection";
import Marquee from "@/components/layout/Marqee";
import PopupModal from "@/components/HomePage/PopupModal";

export const metadata = {
  title: "Home | Paras Urology & Multispeciality Hospital Ajmer",
  description:
    "Welcome to Paras Urology & Multispeciality Hospital (PUMH). We provide advanced medical care in Urology, Nephrology, and more with over 20,000 successful procedures.",
  keywords:
    "Paras Urology, best hospital Ajmer, Urology Ajmer, Nephrology Ajmer, hospital Ajmer, Dr. Rajkumar Khasgiwala",
  openGraph: {
    title: "Home | Paras Urology & Multispeciality Hospital Ajmer",
    description:
      "Welcome to Paras Urology & Multispeciality Hospital (PUMH). We provide advanced medical care in Urology, Nephrology, and more.",
    images: [
      {
        url: "/images/hospital-about.png",
        width: 1200,
        height: 630,
        alt: "Paras Urology & Multispeciality Hospital Ajmer",
      },
    ],
    type: "website",
    url: "https://parashospitalajmer.com",
    siteName: "Paras Urology & Multispeciality Hospital",
  },
  alternates: {
    canonical: "https://parashospitalajmer.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Paras Urology & Multispeciality Hospital Ajmer",
    description:
      "Welcome to Paras Urology & Multispeciality Hospital (PUMH). We provide advanced medical care in Urology, Nephrology, and more.",
    images: ["/images/hospital-about.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "application-name": "Paras Urology & Multispeciality Hospital",
    author: "Dr. Rajkumar Khasgiwala",
    generator: "Next.js",
    "theme-color": "#ffffff",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Marquee />
      <StatsSection />
      <AboutSection />
      <DepartmentsSlider />
      <DoctorsSlider />
      <EmpanelmentsSlider />
      <GallerySlider />
      <div className="pb-10 bg-white">
        <HospitalAppointment />
      </div>
      <DoctorsProfile />
      <ElfsightWidget />
      <PopupModal />
    </main>
  );
}
