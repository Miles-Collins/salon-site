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

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
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

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
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
        onClick={onClose}
      />
    </div>
  );
}
