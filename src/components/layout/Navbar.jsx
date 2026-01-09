"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-[#002b4a] text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs lg:text-sm">
          <div className="flex gap-3 lg:gap-6">
            <a
              href="tel:+919521894263"
              className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
            >
              <Phone size={14} className="lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">+91-9521894263</span>
              <span className="lg:hidden">Call Us</span>
            </a>
            <a
              href="mailto:parasurologyhospital@gmail.com"
              className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
            >
              <Mail size={14} className="lg:w-4 lg:h-4" />
              <span className="hidden xl:inline">
               parasurologyhospital@gmail.com
              </span>
              <span className="xl:hidden">Email</span>
            </a>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <a
              href="https://www.facebook.com/ParasUrology"
              className="hover:text-blue-200 transition-colors"
              aria-label="Facebook"
              target="_blank"
            >
              <Facebook size={16} className="lg:w-[18px] lg:h-[18px]" />
            </a>
            <a
              href="https://www.instagram.com/parasurology"
              className="hover:text-blue-200 transition-colors"
              aria-label="Instagram"
              target="_blank"
            >
              <Instagram size={16} className="lg:w-[18px] lg:h-[18px]" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC3Oq_C_ae5qQqiflY0h30Kw"
              className="hover:text-blue-200 transition-colors"
              aria-label="Youtube"
              target="_blank"
            >
              <Youtube size={16} className="lg:w-[18px] lg:h-[18px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex justify-between items-center py-2.5 md:py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/images/logo.jpg"
                alt="Hospital Logo"
                className="h-10 md:h-12 lg:h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                About Us
              </Link>
              <Link
                href="/doctors"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                Our Doctors
              </Link>
              <Link
                href="/departments"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                Departments
              </Link>
              
              <Link
                href="/our-empanelment"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                Empanelments
              </Link>

              <Link
                href="/gallery"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm xl:text-base"
              >
                Gallery
              </Link>

              <Link
                href="/book-appointment"
                className="relative overflow-hidden bg-[#002b4a] text-white px-4 xl:px-6 py-2 rounded-lg font-medium text-sm xl:text-base whitespace-nowrap 
  transition-all duration-300 hover:shadow-lg"
              >
                <span className="relative z-10">Book Appointment</span>

                {/* Infinite shining effect */}
                <span
                  className="absolute inset-0 h-30  bg-gradient-to-r from-transparent rotate-0 via-white/40 to-transparent 
    animate-[shine_0.9s_linear_infinite]"
                ></span>
              </Link>
            </div>

            {/* Mobile CTA & Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/book-appointment"
                className="bg-[#002b4a] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-blue-800 font-medium transition-all text-xs md:text-sm whitespace-nowrap"
              >
                Book
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
          )}

          {/* Mobile Menu Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-4 border-b bg-[#002b4a] text-white">
                <h2 className="font-semibold text-lg">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="flex flex-col p-4 space-y-1">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/doctors"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    Our Doctors
                  </Link>
                  <Link
                    href="/departments"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    Departments
                  </Link>
                  
                  <Link
                    href="/our-empanelment"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    Our Empanelments
                  </Link>

                  <Link
                    href="/gallery"
                    className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
                    onClick={closeMobileMenu}
                  >
                    Gallery
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex flex-col gap-3 mb-4">
                  <a
                    href="tel:+919521894263"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    <Phone size={18} />
                    <span className="text-sm">+91-9521894263</span>
                  </a>
                  <a
                    href="mailto:parasurologyhospital@gmail.com"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    <Mail size={18} />
                    <span className="text-sm">
                      parasurologyhospital@gmail.com
                    </span>
                  </a>
                </div>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <a
                    href="https://www.facebook.com/ParasUrology"
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                    aria-label="Facebook"
                    target="_blank"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/parasurology"
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                    aria-label="Instagram"
                    target="_blank"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UC3Oq_C_ae5qQqiflY0h30Kw"
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                    aria-label="Youtube"
                    target="_blank"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
