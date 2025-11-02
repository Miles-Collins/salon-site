import Section from "@/components/Section";
import Image from "next/image";

// Gallery images from Gatsby Studios
const galleryImages = [
  { src: "/gallery/2025-10-09.webp", alt: "Color Rebel salon work" },
  { src: "/gallery/2025-10-12.webp", alt: "Hair styling at Color Rebel" },
  { src: "/gallery/2025-10-13.webp", alt: "Color treatment results" },
  { src: "/gallery/2025-10-133.webp", alt: "Salon styling work" },
  { src: "/gallery/2025-10-134.webp", alt: "Hair color transformation" },
  { src: "/gallery/2025-10-135.webp", alt: "Professional hair styling" },
  { src: "/gallery/2025-10-136.webp", alt: "Color Rebel hair work" },
  { src: "/gallery/2025-10-137.webp", alt: "Salon color results" },
  { src: "/gallery/2025-10-138.webp", alt: "Hair transformation" },
];

export default function GalleryPage() {
  return (
    <Section>
      <div className="max-w-6xl mx-auto">
        <h1 className="h2 mb-2">Gallery</h1>
        <p className="muted mb-8">
          Take a look at our studio space and recent work at Color Rebel by Porscha.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
