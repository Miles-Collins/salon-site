"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ImageLightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, currentIndex, onClose }: ImageLightboxProps) {

  const [index, setIndex] = useState(currentIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // useCallback to ensure stable references for useEffect dependencies
  const handleNext = React.useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = React.useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleClose = React.useCallback(() => {
    // Exit fullscreen if active before closing
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsOpen(false);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

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
  }, [handleClose, handleNext, handlePrevious, toggleFullscreen]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      isOpen ? "bg-black/95 backdrop-blur-sm" : "bg-black/0"
    }`}>
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 left-4 text-white/80 hover:text-white transition z-50 hover:scale-110 duration-200"
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
        className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl hover:scale-110 transition z-50 duration-200"
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Previous button */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 md:left-8 text-white/60 hover:text-white text-5xl hover:scale-125 transition z-50 duration-200 hover:drop-shadow-lg"
        aria-label="Previous image"
      >
        ‹
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 text-white/60 hover:text-white text-5xl hover:scale-125 transition z-50 duration-200 hover:drop-shadow-lg"
        aria-label="Next image"
      >
        ›
      </button>

      {/* Image */}
      <div className={`relative w-full h-full flex items-center justify-center p-4 md:p-16 transition-all duration-300 ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
        <div className="relative max-w-7xl max-h-full w-full h-full rounded-lg overflow-hidden shadow-2xl">
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

      {/* Image counter with premium styling */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
        <span className="text-[#C9A961]">{index + 1}</span> / {images.length}
      </div>

      {/* Thumbnail strip (optional) */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 gap-2 bg-black/30 p-3 rounded-lg backdrop-blur-sm hidden md:flex">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-10 h-10 rounded transition-all ${
              i === index
                ? "border-2 border-[#C9A961] scale-110"
                : "border border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
            }`}
            aria-label={`Go to image ${i + 1}`}
          >
            <div className="w-full h-full bg-gray-600/30 rounded" />
          </button>
        ))}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10 cursor-pointer"
        onClick={handleClose}
      />
    </div>
  );
}
