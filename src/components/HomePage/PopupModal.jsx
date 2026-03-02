"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivePopupBanner } from "@/lib/firebase/popup";

const PopupModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [autoCloseSeconds, setAutoCloseSeconds] = useState(15);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");

        if (!hasSeenPopup) {
            const fetchPopupData = async () => {
                try {
                    const result = await getActivePopupBanner();

                    if (result.success && result.data?.imageUrl) {
                        setImageUrl(result.data.imageUrl);
                        setAutoCloseSeconds(result.data.autoCloseSeconds || 15);
                        setIsVisible(true);
                        sessionStorage.setItem("hasSeenPopup", "true");
                    }
                    // No fallback — if no active banner, don't show popup
                } catch (error) {
                    console.warn("Failed to fetch popup banner:", error.message);
                }
            };

            fetchPopupData();
        }
    }, []);

    // Auto-close timer
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, autoCloseSeconds * 1000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseSeconds]);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && imageUrl && (
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

                        {/* Image Container - 1:1 aspect ratio */}
                        <div className="relative w-[80vw] max-w-[500px] aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt="Popup Banner"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupModal;
