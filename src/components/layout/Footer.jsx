"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Doctors", href: "/doctors" },
    { name: "Departments", href: "/departments" },
    { name: "Empanelments", href: "/our-empanelment" },
    { name: "Gallery", href: "/gallery" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/ParasUrology", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/parasurology", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/channel/UC3Oq_C_ae5qQqiflY0h30Kw", label: "YouTube" },
    // { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-[#002b4a] via-[#002b4a] to-[#002b4a] text-white">
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Google Maps Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-white text-center">
            Find Us Here
          </h3>
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.1680511603363!2d74.60461757488017!3d26.48253347844607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be73e8a3211ef%3A0x7ac5154a134f812e!2sDr%20Rajkumar%20Khasgiwala%20(Paras%20Urology%20And%20Multispeciality%20Hospital)%20-%20Urologist%20in%20Ajmer%2FKidney%20Stone%2FProstate%2FAndrologist!5e0!3m2!1sen!2sin!4v1762839093967!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Company Info */}
          <div>
            <div className="bg-white backdrop-blur-md p-4 rounded-xl w-fit mb-6">
              <div className="relative w-60 h-16">
                <Image
                  src="/images/logo.jpg"
                  alt="Paras Hospital Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-blue-100 text-sm leading-relaxed">
              At Paras Urology and Multispeciality Hospital, We are committed to provide high-quality medical services in the field of different branches of medicine. We focus on prompt diagnosis, standardized medical care with advanced medical technology, and efficient staff leading to a happy and healthy discharge to home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-blue-600/50 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-blue-600/50 pb-2">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+919521894263"
                className="flex items-start gap-3 text-blue-100 hover:text-yellow-400 transition-colors duration-300"
              >
                <Phone className="w-5 h-5 mt-0.5 text-yellow-400" />
                <span className="text-sm">+91-95218-94263</span>
              </a>
             <a
                href="tel:0145-2941941"
                className="flex items-start gap-3 text-blue-100 hover:text-yellow-400 transition-colors duration-300"
              >
                <Phone className="w-5 h-5 mt-0.5 text-yellow-400" />
                <span className="text-sm">0145-2941941</span>
              </a>
              <a
                href="tel:0145-2942942"
                className="flex items-start gap-3 text-blue-100 hover:text-yellow-400 transition-colors duration-300"
              >
                <Phone className="w-5 h-5 mt-0.5 text-yellow-400" />
                <span className="text-sm">0145-2942942</span>
              </a>
              <a
                href="mailto:parasurologyhospital@gmail.com"
                className="flex items-start gap-3 text-blue-100 hover:text-yellow-400 transition-colors duration-300 break-all"
              >
                <Mail className="w-5 h-5 mt-0.5 text-yellow-400" />
                <span className="text-sm">parasurologyhospital@gmail.com</span>
              </a>

              <div className="flex items-start gap-3 text-blue-100">
                <MapPin className="w-5 h-5 mt-0.5 text-yellow-400" />
                <span className="text-sm">
                  Haribhau Upadhyay Nagar C Block, Pushkar Road, Ajmer (Raj) 305001
                </span>
              </div>

              <div className="pt-4">
                <h4 className="text-lg font-semibold mb-3 text-white">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 hover:bg-yellow-400 p-2.5 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      >
                        <Icon className="w-5 h-5 text-white hover:text-blue-900 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      {/* Copyright */}
      <div className="bg-blue-950 border-t border-blue-800/60 text-center py-4">
        <p className="text-sm text-blue-200">
          © {currentYear}, Powered by <a href="https://seocialmedia.in/" target="_blank" className="text-green-400"> SEOcial Media Solutions</a>
        </p>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="https://wa.me/919521894263"
          target="_blank"
          rel="noopener noreferrer"
          className=" hover:scale-110  rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="WhatsApp"
        >
          <svg
            width="46"
            height="46"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
              fill="#bfc8d0"
            />
            <path
              d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
              fill="url(#paint0_linear_87_7264)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
              fill="white"
            />
            <path
              d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_87_7264"
                x1={26.5}
                y1={7}
                x2={4}
                y2={28}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5BD066" />
                <stop offset={1} stopColor="#27B43E" />
              </linearGradient>
            </defs>
          </svg>
        </a>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="tel:+919521894263"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Call"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
}