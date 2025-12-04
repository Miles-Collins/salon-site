import Link from "next/link";
import Section from "@/components/Section";
import Image from "next/image";
import heroImg from "../../public/hero.jpg";
import logoImg from "../../public/ColorRebelTransparent.png";
import { createClient } from "@supabase/supabase-js";
import GoogleReviews from "@/components/GoogleReviews";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Color Rebel by Porscha | Leavenworth Hair Salon",
  description: "One-on-one salon experience specializing in vivid color, extensions, and precision styling. Book online.",
  openGraph: {
    title: "Color Rebel by Porscha",
    description: "Vivid color, extensions, and precision styling in Leavenworth, KS.",
    url: "https://colorrebelbyporscha.com/",
    siteName: "Color Rebel by Porscha",
    images: [
      { url: "https://colorrebelbyporscha.com/api/og?page=home", width: 1200, height: 630, alt: "Color Rebel by Porscha" }
    ],
    locale: "en_US",
    type: "website",
  },
};

async function getContent() {
  // If env vars are missing (e.g., during build without Supabase), return defaults
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {};
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from("site_content").select("key, value");
  const map: Record<string, any> = {};
  (data || []).forEach((row: any) => (map[row.key] = row.value));
  return map as { hero?: { title?: string; subtitle?: string }; announcement?: { enabled?: boolean; text?: string } };
}

export default async function HomePage() {
  const content = await getContent();
  const heroTitle = content.hero?.title || "COLOR REBEL BY";
  const heroSubtitle = content.hero?.subtitle || "PORSCHA";
  const announcement = content.announcement;
  return (
    <>
      {/* Schema.org LocalBusiness */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: "Color Rebel by Porscha",
          image: "https://colorrebelbyporscha.com/hero-og.jpg",
          url: "https://colorrebelbyporscha.com/",
          telephone: "+1-913-680-7987",
          email: "PorschaCradic@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "301 S 5th St",
            addressLocality: "Leavenworth",
            addressRegion: "KS",
            postalCode: "66048",
            addressCountry: "US"
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Tuesday",
              opens: "12:00",
              closes: "20:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Thursday",
              opens: "11:00",
              closes: "20:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Friday",
              opens: "10:00",
              closes: "17:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:00",
              closes: "16:00"
            }
          ]
        })
      }} />
      {/* HERO - full viewport with image and overlay */}
  <div className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg}
          alt="Salon interior"
          fill
          priority
          placeholder="blur"
          className="absolute inset-0 object-cover object-center opacity-80 transform-gpu"
          style={{ transform: 'translateZ(0)' }}
          sizes="(min-width: 1280px) 1280px, 100vw"
          quality={70}
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/70 via-black/40 to-purple/20" />
        <div className="absolute inset-0 w-full h-full grain-overlay" />
        {/* Mobile: centered logo overlay */}
        <div className="relative z-10 flex md:hidden items-center justify-center h-full">
          <Image
            src={logoImg}
            alt="Color Rebel by Porscha logo"
            width={300}
            height={300}
            priority
            className="w-64 xs:w-72 sm:w-80 h-auto drop-shadow-2xl logo-glow"
          />
        </div>
  <div className="relative z-10 text-center w-full px-4 md:px-4 flex-col items-center justify-center h-full hidden md:flex">
          {/* Text only - no logo on tablet/desktop */}
          <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight mb-8">
            <span className="block text-outline-white font-light tracking-wide">{heroTitle}</span>
            <span className="block text-cheetah">{heroSubtitle}</span>
          </h1>
          <Link
            href="/book"
            className="inline-block border border-white/80 text-white px-7 py-3 text-base md:text-lg font-semibold tracking-wide hover:bg-white/10 hover:border-white transition-all hover:shadow-lg hover:scale-105"
          >
            BOOK NOW
          </Link>
        </div>
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="scroll-indicator text-white/60">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {announcement?.enabled && announcement?.text && (
        <div className="bg-black text-white text-center py-2">
          <span className="text-sm">{announcement.text}</span>
        </div>
      )}

      {/* About/Intro Section */}
      <Section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="h2 mb-6">Welcome</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Experience a relaxing, one-on-one salon visit. Transparent pricing, easy online booking, and expert care for every hair type.
          </p>
        </div>
      </Section>

      {/* Services Preview */}
      <Section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {[
              { t: "Cuts & Styling", d: "Precision cuts, blowouts, and event styling." },
              { t: "Color & Highlights", d: "Balayage, highlights, and vibrant color." },
              { t: "Treatments", d: "Deep conditioning, repair, and smoothing." },
            ].map((x) => (
              <div key={x.t} className="card p-8 text-center hover:shadow-lg transition-all">
                <h3 className="text-xl font-semibold mb-3">{x.t}</h3>
                <p className="text-gray-600 text-base">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/services" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}

async function FAQSection() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, category")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  const faqs = data || [];

  if (faqs.length === 0) return null;

  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h2 className="h2 text-center mb-16">Frequently Asked Questions</h2>
          <FAQAccordion faqs={faqs} />
        </div>
      </Section>
    </>
  );
}

async function TestimonialsSection() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  // Use real data if available, otherwise use fake testimonials for preview
  let testimonials = data || [];
  
  if (testimonials.length === 0) {
    testimonials = [
      {
        id: "fake-1",
        client_name: "Sarah Mitchell",
        quote: "Porscha completely transformed my look! The color is vibrant and exactly what I envisioned. She's so attentive to detail.",
        rating: 5,
        service: "Balayage & Cut",
        photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
      },
      {
        id: "fake-2",
        client_name: "Jessica Rodriguez",
        quote: "Best salon experience I've had. The one-on-one attention made all the difference. My hair has never looked better!",
        rating: 5,
        service: "Color Correction",
        photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
      },
      {
        id: "fake-3",
        client_name: "Amanda Chen",
        quote: "The extensions are flawless and blend perfectly. Porscha really knows her craft. Highly recommend!",
        rating: 5,
        service: "Hair Extensions",
        photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
      },
      {
        id: "fake-4",
        client_name: "Michelle Thompson",
        quote: "From consultation to final result, everything was perfect. She listened to what I wanted and delivered beyond expectations.",
        rating: 5,
        service: "Cut & Style",
        photo_url: "https://images.unsplash.com/photo-1517097457149-a46b5f10e248?w=96&h=96&fit=crop",
      },
      {
        id: "fake-5",
        client_name: "Katie Wilson",
        quote: "The relaxing atmosphere and professional service kept me coming back. Love my new look every time!",
        rating: 5,
        service: "Vivid Color",
        photo_url: "https://images.unsplash.com/photo-1516080804080-5d0edd5b9355?w=96&h=96&fit=crop",
      },
    ];
  }

  if (testimonials.length === 0) return null;

  // Separate featured testimonial (first one) from others
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <Section className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle jewel tone accent overlay */}
      <div className="absolute inset-0 pointer-events-none testimonials-overlay" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="h2 font-serif mb-6">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real transformations, real happiness</p>
        </div>

        {/* Featured Testimonial - Large Premium Card */}
        {featured && (
          <div className="mb-16 fade-in-up">
            <div className="relative bg-white rounded-3xl shadow-lg p-8 md:p-12 border-t-4 border-b-4 border-[#C9A961]">
              {/* Large decorative quote mark */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 text-6xl md:text-8xl text-[#C9A961]/20 font-serif leading-none">&ldquo;</div>
              
              <div className="relative z-10">
                {featured.photo_url && (
                  <div className="flex items-center gap-4 md:gap-6 mb-6">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#C9A961] flex-shrink-0">
                      <Image
                        src={featured.photo_url}
                        alt={featured.client_name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[#C9A961] text-xl md:text-2xl mb-2">
                        {"★".repeat(featured.rating || 5)}
                      </div>
                      <div className="font-semibold text-lg text-black">{featured.client_name}</div>
                      {featured.service && <div className="text-sm text-gray-600">{featured.service}</div>}
                    </div>
                  </div>
                )}
                <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed">&ldquo;{featured.quote}&rdquo;</p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Testimonials Grid */}
        {others.length > 0 && (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((t: any) => (
                <div key={t.id} className="carousel-item fade-in-up">
                  <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col border-l-4 border-[#C9A961] hover:shadow-lg transition-shadow">
                    {/* Small decorative quote */}
                    <div className="text-3xl text-[#C9A961]/30 font-serif leading-none mb-2">&ldquo;</div>
                    
                    {t.rating && (
                      <div className="text-[#C9A961] text-base mb-3 flex gap-1">
                        {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                      </div>
                    )}
                    
                    <p className="text-gray-700 italic flex-grow mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-3">
                        {t.photo_url && (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A961] flex-shrink-0">
                            <Image
                              src={t.photo_url}
                              alt={t.client_name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-black">{t.client_name}</div>
                          {t.service && <div className="text-xs text-gray-500">{t.service}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Google Reviews CTA */}
        <div className="mt-16 flex justify-center fade-in-up">
          <GoogleReviews />
        </div>
      </div>
    </Section>
  );
}
