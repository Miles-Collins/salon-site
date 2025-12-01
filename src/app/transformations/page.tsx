import Section from "@/components/Section";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type GalleryImage = {
  name: string;
  caption?: string;
  tags?: string[];
  is_before_after?: boolean;
  before_image?: string;
};

async function getTransformations() {
  // If env vars are missing (e.g., during build without Supabase), return empty array
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_before_after", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data || []) as GalleryImage[];
}

export default async function TransformationsPage() {
  const transformations = await getTransformations();

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Stunning <span className="text-brand-accent">Transformations</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the dramatic before & after results of our color expertise, precision cuts, and creative styling.
          </p>
          <Link href="/book" className="btn-primary">
            Book Your Transformation
          </Link>
        </div>
      </Section>

      {/* Before/After Grid */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto">
          {transformations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Transformation gallery coming soon! Check back for amazing before & after reveals.
              </p>
              <Link href="/gallery" className="btn-outline mt-6 inline-block">
                View Full Gallery
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 md:gap-16">
              {transformations.map((transformation, idx) => {
                const beforeUrl = transformation.before_image
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${transformation.before_image}`
                  : null;
                const afterUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${transformation.name}`;

                return (
                  <div key={transformation.name} className="space-y-4">
                    {transformation.caption && (
                      <h3 className="text-2xl font-semibold text-center text-gray-900">
                        {transformation.caption}
                      </h3>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Before */}
                      {beforeUrl && (
                        <div className="relative">
                          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded">
                            BEFORE
                          </div>
                          <div className="relative aspect-[3/4] rounded overflow-hidden shadow-lg">
                            <Image
                              src={beforeUrl}
                              alt={`Before transformation ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        </div>
                      )}

                      {/* After */}
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-brand-accent text-white text-sm font-semibold rounded">
                          AFTER
                        </div>
                        <div className="relative aspect-[3/4] rounded overflow-hidden shadow-lg">
                          <Image
                            src={afterUrl}
                            alt={`After transformation ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                    {transformation.tags && transformation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {transformation.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {idx < transformations.length - 1 && (
                      <div className="pt-8 border-b border-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-gray-600 mb-8">
            Book your appointment today and let&apos;s create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary">
              Book Now
            </Link>
            <Link href="/gallery" className="btn-outline">
              View Full Gallery
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
