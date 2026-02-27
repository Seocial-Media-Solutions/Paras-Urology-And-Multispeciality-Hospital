import { getDoctorBySlug } from "@/lib/firebase/doctors";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const doctorSeoData = require("../../../../public/doctor.json");
    const metadata = doctorSeoData.find((doctor) => doctor.slug == slug);

    const result = await getDoctorBySlug(slug);
    const doctor = (result.success && result.data) ? result.data : metadata;

    if (doctor) {
        const title = metadata?.title || doctor?.title || doctor?.name || "Doctor Profile";
        const description = metadata?.description || doctor?.about?.substring(0, 150) || doctor?.description || "Doctor Profile at Paras Urology & Multispeciality Hospital";
        const keywords = metadata?.keywords || doctor?.expertise || "";

        return {
            title,
            description,
            keywords,
            openGraph: {
                title,
                description,
                images: doctor?.imageUrl
                    ? [
                        {
                            url: doctor.imageUrl,
                            width: 800,
                            height: 600,
                            alt: doctor.name || title,
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
                images: doctor?.imageUrl ? [doctor.imageUrl] : [],
            },
            robots: {
                index: true,
                follow: true,
            },
            other: {
                "application-name": "Paras Urology & Multispeciality Hospital",
                author: doctor?.name || title,
                generator: "Next.js",
                "theme-color": "#ffffff",
            },
        };
    }

    return {};
}

export default function DoctorProfileLayout({ children }) {
    return <>{children}</>;
}
