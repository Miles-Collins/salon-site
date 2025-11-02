"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageLightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, currentIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(currentIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    // Exit fullscreen if active before closing
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 left-4 text-white hover:text-gray-300 transition z-50"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        )}
      </button>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition z-50"
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Previous button */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 text-white text-5xl hover:text-gray-300 transition z-50"
        aria-label="Previous image"
      >
        ‹
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-4 text-white text-5xl hover:text-gray-300 transition z-50"
        aria-label="Next image"
      >
        ›
      </button>

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-16">
        <div className="relative max-w-7xl max-h-full w-full h-full">
          <Image
            src={images[index].src}
            alt={images[index].alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        {index + 1} / {images.length}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
      />
    </div>
  );
}
