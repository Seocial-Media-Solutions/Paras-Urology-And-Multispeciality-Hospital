export const metadata = {
    title: "Specialized Medical Departments | Multispeciality Hospital Ajmer",
    description:
        "Explore our wide range of medical departments including Urology, Nephrology, Laparoscopic Surgery, Pediatrics, and more at Paras Urology & Multispeciality Hospital Ajmer.",
    keywords:
        "urology department Ajmer, nephrology Ajmer, surgery hospital, medical specialties Ajmer, laparoscopic surgery Ajmer",
    openGraph: {
        title: "Specialized Medical Departments | Paras Urology & Multispeciality Hospital",
        description:
            "Explore our wide range of medical departments at Paras Urology & Multispeciality Hospital Ajmer.",
        images: [
            {
                url: "/images/hospital-about.png",
                width: 1200,
                height: 630,
                alt: "Paras Urology & Multispeciality Hospital Ajmer",
            },
        ],
        type: "website",
        url: "https://parashospitalajmer.com/departments",
        siteName: "Paras Urology & Multispeciality Hospital",
    },
    alternates: {
        canonical: "https://parashospitalajmer.com/departments",
    },
    twitter: {
        card: "summary_large_image",
        title: "Specialized Medical Departments | Paras Urology & Multispeciality Hospital",
        description:
            "Explore our medical departments at Paras Urology & Multispeciality Hospital Ajmer.",
        images: ["/images/hospital-about.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "application-name": "Paras Urology & Multispeciality Hospital",
        author: "Paras Hospital Team",
        generator: "Next.js",
        "theme-color": "#ffffff",
    },
};

export default function DepartmentsLayout({ children }) {
    return <>{children}</>;
}
