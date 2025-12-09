"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

// Gallery images from Gatsby Studios
type GItem = { src: string; alt: string; span?: string; caption?: string | null; display_order?: number | null; created_at?: string };

const fallbackImages: GItem[] = [
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
  const [images, setImages] = useState<GItem[]>(fallbackImages);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/owner/gallery/list");
        if (!res.ok) return; // fall back silently
        const json = await res.json();
        // Filter to only gallery bucket images (exclude transformations and services)
        const items: GItem[] = (json.items || [])
          .filter((i: any) => !i.bucket || i.bucket === "gallery")
          .map((i: any) => ({
            src: i.url,
            alt: i.caption || i.name,
            caption: i.caption || null,
            display_order: i.display_order ?? null,
            created_at: i.created_at,
          }));
        items.sort((a, b) => {
          const ao = a.display_order ?? Number.MAX_SAFE_INTEGER;
          const bo = b.display_order ?? Number.MAX_SAFE_INTEGER;
          if (ao !== bo) return ao - bo;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
        if (items.length) setImages(items);
      } catch {}
    };
    load();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleImageLoad = (index: number) => {
    setLoadedIndices((prev) => new Set(prev).add(index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pt-24 md:pt-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold tracking-tight mb-6">Gallery</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest transformations and premium salon work
          </p>
        </div>
      </div>
      
      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4 md:gap-6">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden group ${image.span} cursor-pointer rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105`}
              aria-label={`View ${image.caption || image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                  loadedIndices.has(index) ? "opacity-100" : "opacity-0"
                }`}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                onLoad={() => handleImageLoad(index)}
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {image.caption && (
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                )}
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/5 group-hover:to-white/0 transition-all duration-500 pointer-events-none"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
