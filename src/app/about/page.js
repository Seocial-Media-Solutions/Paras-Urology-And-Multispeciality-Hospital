import AboutUsSection from "@/components/About-Us/AboutUsSection";
import DirectorSection from "@/components/About-Us/DirectorSection";
import VisionMissionSection from "@/components/About-Us/VisionMissionSection";
import DoctorsSlider from "@/components/HomePage/DoctorSlider";
import EmpanelmentsSlider from "@/components/HomePage/EmpanelmentsSlider";
import OtherHeroSection from "@/components/OtherHeroSection";

export const metadata = {
    title: "About Us | Paras Urology & Multispeciality Hospital",
    description:
        "Learn more about Paras Urology & Multispeciality Hospital (PUMH) in Ajmer, our mission, vision, and the leadership of Dr. Rajkumar Khasgiwala.",
    keywords:
        "about Paras Urology, hospital history Ajmer, Dr. Rajkumar Khasgiwala, PUMH mission, medical care Ajmer",
    openGraph: {
        title: "About Us | Paras Urology & Multispeciality Hospital",
        description:
            "Learn more about Paras Urology & Multispeciality Hospital (PUMH) in Ajmer, our mission, vision, and leadership.",
        images: [
            {
                url: "/images/hospital-about.png",
                width: 1200,
                height: 630,
                alt: "Paras Urology & Multispeciality Hospital Ajmer",
            },
        ],
        type: "website",
        url: "https://parashospitalajmer.com/about",
        siteName: "Paras Urology & Multispeciality Hospital",
    },
    alternates: {
        canonical: "https://parashospitalajmer.com/about",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Paras Urology & Multispeciality Hospital",
        description:
            "Learn more about Paras Urology & Multispeciality Hospital (PUMH) in Ajmer.",
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

export default function AboutPage() {
    return (
        <>
            <OtherHeroSection title={'About Us'} imageUrl={'/images/hero4.jpg'} />
            <AboutUsSection />
            <VisionMissionSection />
            <DirectorSection />
            <EmpanelmentsSlider />
            <DoctorsSlider />

        </>
    );

}