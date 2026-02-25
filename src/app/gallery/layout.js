export const metadata = {
    title: "Hospital Gallery & Media | Paras Urology & Multispeciality Hospital",
    description:
        "View images of our facilities, events, and media coverage. See why Paras Urology & Multispeciality Hospital is a leading healthcare provider in Ajmer.",
    keywords:
        "hospital gallery Ajmer, medical facilities, hospital events, media coverage Ajmer, PUMH gallery",
    openGraph: {
        title: "Hospital Gallery & Media | Paras Urology & Multispeciality Hospital",
        description:
            "View images of our facilities, events, and media coverage at Paras Urology & Multispeciality Hospital.",
        images: [
            {
                url: "/images/hospital-about.png",
                width: 1200,
                height: 630,
                alt: "Paras Urology & Multispeciality Hospital Ajmer",
            },
        ],
        type: "website",
        url: "https://parashospitalajmer.com/gallery",
        siteName: "Paras Urology & Multispeciality Hospital",
    },
    alternates: {
        canonical: "https://parashospitalajmer.com/gallery",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hospital Gallery & Media | Paras Urology & Multispeciality Hospital",
        description:
            "View images of our facilities and events at Paras Urology & Multispeciality Hospital.",
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

export default function GalleryLayout({ children }) {
    return <>{children}</>;
}
