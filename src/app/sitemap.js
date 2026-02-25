import { getDoctors } from "@/lib/firebase/doctors";

export default async function sitemap() {
    const baseUrl = "https://parashospitalajmer.com";
    const currentDate = new Date();

    // Static pages with priority and frequency
    const staticPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/doctors`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/departments`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/book-appointment`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/our-empanelment`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    // Dynamic doctor profiles
    let doctorPages = [];
    try {
        const result = await getDoctors();
        if (result.success && result.data) {
            doctorPages = result.data.map((doctor) => ({
                url: `${baseUrl}/doctors/${doctor.slug}`,
                lastModified: currentDate,
                changeFrequency: "weekly",
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error("Sitemap: Failed to fetch doctors", error);
    }

    return [...staticPages, ...doctorPages];
}
