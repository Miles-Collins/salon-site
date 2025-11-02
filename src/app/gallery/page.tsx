"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

// Gallery images from Gatsby Studios
const galleryImages = [
  { src: "/gallery/2025-10-09.webp", alt: "Color Rebel salon work", span: "col-span-2 row-span-2" },
  { src: "/gallery/2025-10-12.webp", alt: "Hair styling at Color Rebel", span: "col-span-1 row-span-1" },
  { src: "/gallery/2025-10-13.webp", alt: "Color treatment results", span: "col-span-1 row-span-1" },
  { src: "/gallery/2025-10-133.webp", alt: "Salon styling work", span: "col-span-1 row-span-2" },
  { src: "/gallery/2025-10-134.webp", alt: "Hair color transformation", span: "col-span-1 row-span-1" },
  { src: "/gallery/2025-10-135.webp", alt: "Professional hair styling", span: "col-span-2 row-span-1" },
  { src: "/gallery/2025-10-136.webp", alt: "Color Rebel hair work", span: "col-span-1 row-span-1" },
  { src: "/gallery/2025-10-137.webp", alt: "Salon color results", span: "col-span-1 row-span-2" },
  { src: "/gallery/2025-10-138.webp", alt: "Hair transformation", span: "col-span-2 row-span-1" },
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-center mb-4">GALLERY</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Explore our latest work and transformations at Color Rebel by Porscha
        </p>
      </div>
      
      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-2">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={`relative overflow-hidden group ${image.span} cursor-pointer`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
