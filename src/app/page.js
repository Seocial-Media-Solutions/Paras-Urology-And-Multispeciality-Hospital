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
