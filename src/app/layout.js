import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Best Multispeciality Hospital in Ajmer | Paras Urology & Multispeciality Hospital",
  description:
    "Paras Urology & Multispeciality Hospital (PUMH) in Ajmer offers expert care in Urology, Nephrology, and Laparoscopic surgery led by Dr. Rajkumar Khasgiwala.",
  keywords:
    "Paras Urology, Multispeciality Hospital Ajmer, Urology Hospital Ajmer, Dr. Rajkumar Khasgiwala, Raj Uro Care Centre, Nephrology, General Surgery, Laparoscopic Surgery, Laser Surgery, Ajmer Hospital, Best Hospital in Ajmer, Kidney Stone Treatment, Urology Specialists Ajmer, PUMH Ajmer",
  openGraph: {
    title: "Best Multispeciality Hospital in Ajmer | Paras Urology & Multispeciality Hospital",
    description:
      "Expert medical care in Urology, Nephrology, and General Surgery at Paras Urology & Multispeciality Hospital in Ajmer. Led by Dr. Rajkumar Khasgiwala.",
    images: [
      {
        url: "/images/hospital-about.png",
        width: 1200,
        height: 630,
        alt: "Paras Urology & Multispeciality Hospital Ajmer",
      },
    ],
    type: "website",
    url: "https://parashospitalajmer.com",
    siteName: "Paras Urology & Multispeciality Hospital",
  },
  alternates: {
    canonical: "https://parashospitalajmer.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Multispeciality Hospital in Ajmer | Paras Urology & Multispeciality Hospital",
    description:
      "Leading healthcare provider in Ajmer offering comprehensive medical services in Urology and other specialities.",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {/* Add padding to prevent content from being hidden under fixed navbar */}
        <div className="pt-[52px] md:pt-[88px] text-black placeholder-black">
          {children}
        </div>
        <Footer />

      </body>
    </html>
  );
}