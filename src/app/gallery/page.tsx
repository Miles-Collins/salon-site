import Section from "@/components/Section";
import Image from "next/image";

// Add your Gatsby Studios images to the public/gallery folder
// Then list them here
const galleryImages = [
  { src: "/gallery/image1.jpg", alt: "Salon interior" },
  { src: "/gallery/image2.jpg", alt: "Hair styling" },
  { src: "/gallery/image3.jpg", alt: "Color treatment" },
  { src: "/gallery/image4.jpg", alt: "Salon workspace" },
  { src: "/gallery/image5.jpg", alt: "Hair color results" },
  { src: "/gallery/image6.jpg", alt: "Styling station" },
  // Add more images as needed
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
