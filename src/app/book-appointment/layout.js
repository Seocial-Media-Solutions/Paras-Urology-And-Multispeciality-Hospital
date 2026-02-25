export const metadata = {
    title: "Book an Appointment | Paras Urology & Multispeciality Hospital",
    description:
        "Schedule your consultation with our expert doctors online. Quick and easy appointment booking for all medical departments at Paras Urology & Multispeciality Hospital Ajmer.",
    keywords:
        "book appointment hospital Ajmer, online doctor consultation, hospital booking Ajmer, PUMH appointments",
    openGraph: {
        title: "Book an Appointment | Paras Urology & Multispeciality Hospital",
        description:
            "Schedule your consultation with our expert doctors online at Paras Urology & Multispeciality Hospital Ajmer.",
        images: [
            {
                url: "/images/hospital-about.png",
                width: 1200,
                height: 630,
                alt: "Paras Urology & Multispeciality Hospital Ajmer",
            },
        ],
        type: "website",
        url: "https://parashospitalajmer.com/book-appointment",
        siteName: "Paras Urology & Multispeciality Hospital",
    },
    alternates: {
        canonical: "https://parashospitalajmer.com/book-appointment",
    },
    twitter: {
        card: "summary_large_image",
        title: "Book an Appointment | Paras Urology & Multispeciality Hospital",
        description:
            "Schedule your consultation with our expert doctors online at Paras Urology & Multispeciality Hospital Ajmer.",
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

export default function AppointmentLayout({ children }) {
    return <>{children}</>;
}
