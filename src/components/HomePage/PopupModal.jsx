"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PopupModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the popup has already been shown in this session
        const hasSeenPopup = sessionStorage.getItem("hasSeenAnniversaryPopup");

        if (!hasSeenPopup) {
            setIsVisible(true);
            // Mark as seen immediately so it doesn't show again on refresh
            sessionStorage.setItem("hasSeenAnniversaryPopup", "true");

            // Auto-close after 15 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-[90vw] md:max-w-fit mx-4"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                            aria-label="Close popup"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Container - simplified for vertical images */}
                        <div className="relative flex justify-center items-center">
                            {/* Use standard img tag to respect natural aspect ratio of unknown image dimensions */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/anniversary.jpg"
                                alt="Anniversary Celebration"
                                className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupModal;
