import AboutUsSection from "@/components/About-Us/AboutUsSection";
import DirectorSection from "@/components/About-Us/DirectorSection";
import VisionMissionSection from "@/components/About-Us/VisionMissionSection";
import DoctorsSlider from "@/components/HomePage/DoctorSlider";
import EmpanelmentsSlider from "@/components/HomePage/EmpanelmentsSlider";
import OtherHeroSection from "@/components/OtherHeroSection";

export default function AboutPage() {  
    return (  
        <>
         <OtherHeroSection title={'About Us'} imageUrl={'/images/hero4.jpg'} />
         <AboutUsSection/>
         <VisionMissionSection/>
         <DirectorSection/>
         <EmpanelmentsSlider/>
         <DoctorsSlider/>

        </>
     );

}