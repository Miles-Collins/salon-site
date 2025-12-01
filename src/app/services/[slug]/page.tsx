import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { serviceCategories } from "@/data/services";
import Image from "next/image";
import Link from "next/link";
import BookServiceButton from "@/components/BookServiceButton";

type ProcessStep = {
  step: number;
  title: string;
  desc: string;
};

type PricingTier = {
  name: string;
  price: number;
  description?: string;
};

type ServiceFAQ = {
  q: string;
  a: string;
};

type ServiceDetail = {
  id: string;
  slug: string;
  service_name: string;
  category: string;
  base_price: number | null;
  hero_image: string | null;
  description: string | null;
  process_steps: ProcessStep[];
  pricing_tiers: PricingTier[];
  duration_min: number | null;
  aftercare_tips: string | null;
  faqs: ServiceFAQ[];
  is_published: boolean;
};

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseClient();
  
  const { data: service } = await supabase
    .from("service_details")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  // If no database record, try to find from static data
  if (!service) {
    let foundService = null;
    let foundCategory = "";
    
    for (const cat of serviceCategories) {
      const svc = cat.items.find(item => item.slug === params.slug);
      if (svc) {
        foundService = svc;
        foundCategory = cat.title;
        break;
      }
    }
    
    if (!foundService) {
      notFound();
    }
    
    // Render basic page from static data
    return (
      <div className="min-h-screen">
        <section className="relative bg-black text-white py-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <p className="text-gold text-sm uppercase tracking-wider mb-2">{foundCategory}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{foundService.name}</h1>
              <p className="text-lg text-gray-300 mb-6">{foundService.desc}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-2xl font-semibold text-gold">
                  Starting at ${foundService.price}
                </div>
                <div className="text-gray-300">
                  {foundService.time}
                </div>
              </div>
              <div className="mt-6">
                <BookServiceButton className="inline-block bg-gold text-black px-8 py-3 font-semibold hover:bg-gold/90 transition cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 mb-6">
                Want more details about this service? Visit the owner dashboard to create a detailed service page with process steps, pricing tiers, and FAQs.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-black text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience {foundService.name} with Porscha. Book your appointment today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book"
                className="bg-gold text-black px-8 py-3 font-semibold hover:bg-gold/90 transition"
              >
                Book Now
              </Link>
              <Link
                href="/services"
                className="border border-white text-white px-8 py-3 font-semibold hover:bg-white/10 transition"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const serviceDetail = service as ServiceDetail;
  const heroImageUrl = serviceDetail.hero_image
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${serviceDetail.hero_image}`
    : null;

  // Debug logging (remove after checking)
  console.log('Service Detail:', {
    name: serviceDetail.service_name,
    hero_image: serviceDetail.hero_image,
    heroImageUrl,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white min-h-[85vh] flex items-center">
        {heroImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={serviceDetail.service_name}
              fill
              className="object-cover opacity-50"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA3AD//2Q=="
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>
        )}
        {!heroImageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        )}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <p className="text-gold text-sm uppercase tracking-wider mb-4 drop-shadow-lg">{serviceDetail.category}</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">{serviceDetail.service_name}</h1>
            {serviceDetail.description && (
              <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-lg leading-relaxed">{serviceDetail.description}</p>
            )}
            <div className="flex flex-wrap gap-6 items-center mb-10">
              {serviceDetail.base_price && (
                <div className="text-3xl font-semibold text-gold drop-shadow-lg">
                  Starting at ${serviceDetail.base_price}
                </div>
              )}
              {serviceDetail.duration_min && (
                <div className="text-xl text-white drop-shadow-lg">
                  {serviceDetail.duration_min} minutes
                </div>
              )}
            </div>
            <div>
              <BookServiceButton className="inline-block bg-gold text-white px-10 py-4 text-lg font-bold hover:bg-gold/90 transition shadow-xl hover:shadow-2xl border-2 border-white cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      {serviceDetail.process_steps && serviceDetail.process_steps.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">The Process</h2>
            <div className="max-w-4xl mx-auto space-y-10">
              {serviceDetail.process_steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-gold text-black rounded-full flex items-center justify-center font-bold text-xl">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Tiers */}
      {serviceDetail.pricing_tiers && serviceDetail.pricing_tiers.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Pricing Options</h2>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceDetail.pricing_tiers.map((tier, idx) => (
                <div key={idx} className="bg-white border-2 border-gold p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-semibold mb-3">{tier.name}</h3>
                  {tier.description && (
                    <p className="text-gray-600 mb-6 leading-relaxed">{tier.description}</p>
                  )}
                  <div className="text-3xl font-bold text-gold">${tier.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Aftercare Tips */}
      {serviceDetail.aftercare_tips && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12">Aftercare & Maintenance</h2>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                {serviceDetail.aftercare_tips}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service FAQs */}
      {serviceDetail.faqs && serviceDetail.faqs.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {serviceDetail.faqs.map((faq, idx) => (
                  <details key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gold transition-colors">
                    <summary className="font-semibold cursor-pointer text-xl">{faq.q}</summary>
                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Ready to Book?</h2>
          <p className="text-xl text-black mb-10 max-w-2xl mx-auto leading-relaxed text-center">
            Experience {serviceDetail.service_name} with Porscha. Book your appointment today.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/book"
              className="bg-gold text-black px-10 py-4 text-lg font-semibold hover:bg-gold/90 transition shadow-xl hover:shadow-2xl"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="border-2 border-black text-black px-10 py-4 text-lg font-semibold hover:bg-black/5 transition"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
