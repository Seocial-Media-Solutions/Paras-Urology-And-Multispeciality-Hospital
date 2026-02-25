import { getDoctorBySlug } from "@/lib/firebase/doctors";

export async function generateMetadata({ params }) {
    const { slug } = params;
    const result = await getDoctorBySlug(slug);

    if (result.success && result.data) {
        const doctor = result.data;
        const title = `${doctor.name} | Expert ${doctor.expertise} at Paras Urology & Multispeciality Hospital`;
        const description = `${doctor.name} (${doctor.education}) is a highly experienced ${doctor.expertise} at Paras Urology & Multispeciality Hospital Ajmer. ${doctor.about?.substring(0, 150)}...`;

        return {
            title,
            description,
            keywords: `${doctor.name}, ${doctor.expertise} Ajmer, ${doctor.education}, best doctor Ajmer, Paras Hospital doctor`,
            openGraph: {
                title,
                description,
                images: doctor.imageUrl
                    ? [
                        {
                            url: doctor.imageUrl,
                            width: 800,
                            height: 600,
                            alt: doctor.name,
                        },
                    ]
                    : [],
                type: "website",
                url: `https://parashospitalajmer.com/doctors/${slug}`,
                siteName: "Paras Urology & Multispeciality Hospital",
            },
            alternates: {
                canonical: `https://parashospitalajmer.com/doctors/${slug}`,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: doctor.imageUrl ? [doctor.imageUrl] : [],
            },
            robots: {
                index: true,
                follow: true,
            },
            other: {
                "application-name": "Paras Urology & Multispeciality Hospital",
                author: doctor.name,
                generator: "Next.js",
                "theme-color": "#ffffff",
            },
        };
    }

    return {
        title: "Doctor Profile | Paras Urology & Multispeciality Hospital",
        description:
            "View the profile of our expert medical professional at Paras Urology & Multispeciality Hospital Ajmer.",
    };
}

export default function DoctorProfileLayout({ children }) {
    return <>{children}</>;
}
