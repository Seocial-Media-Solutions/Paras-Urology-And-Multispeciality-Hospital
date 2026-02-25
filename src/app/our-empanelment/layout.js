export const metadata = {
    title: "Empanelments & Insurance Partners | Paras Urology & Multispeciality Hospital",
    description:
        "Check our list of empanelled insurance providers and government schemes. We accept major health insurances and government health cards for cashless treatments.",
    keywords:
        "insurance hospital Ajmer, cashless treatment, government health schemes, empanelled hospitals, health insurance partners",
    openGraph: {
        title: "Empanelments & Insurance Partners | Paras Urology & Multispeciality Hospital",
        description:
            "Check our list of empanelled insurance providers and government schemes at Paras Urology & Multispeciality Hospital.",
        images: [
            {
                url: "/images/hospital-about.png",
                width: 1200,
                height: 630,
                alt: "Paras Urology & Multispeciality Hospital Ajmer",
            },
        ],
        type: "website",
        url: "https://parashospitalajmer.com/our-empanelment",
        siteName: "Paras Urology & Multispeciality Hospital",
    },
    alternates: {
        canonical: "https://parashospitalajmer.com/our-empanelment",
    },
    twitter: {
        card: "summary_large_image",
        title: "Empanelments & Insurance Partners | Paras Urology & Multispeciality Hospital",
        description:
            "Check our insurance partners at Paras Urology & Multispeciality Hospital.",
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

export default function EmpanelmentLayout({ children }) {
    return <>{children}</>;
}
