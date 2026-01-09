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
  title: "Paras Hospital - Quality Healthcare",
  description: "Leading healthcare provider offering comprehensive medical services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {/* Add padding to prevent content from being hidden under fixed navbar */}
        <div className="pt-[52px] md:pt-[88px] text-black placeholder-black">
          {children}
        </div>
          <Footer/>
        
      </body>
    </html>
  );
}