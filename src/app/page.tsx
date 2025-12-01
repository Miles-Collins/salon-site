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
          className="absolute inset-0 object-cover object-center opacity-80"
          sizes="(min-width: 1280px) 1280px, 100vw"
          quality={70}
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/60 to-black/20" />
        {/* Mobile: centered logo overlay */}
        <div className="relative z-10 flex md:hidden items-center justify-center h-full">
          <Image
            src={logoImg}
            alt="Color Rebel by Porscha logo"
            width={300}
            height={300}
            priority
            className="w-64 xs:w-72 sm:w-80 h-auto drop-shadow-2xl"
          />
        </div>
  <div className="relative z-10 text-center w-full px-4 md:px-4 flex-col items-center justify-center h-full hidden md:flex">
          {/* Text only - no logo on tablet/desktop */}
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-8">
            <span className="block text-outline-white font-light tracking-wide">{heroTitle}</span>
            <span className="block text-cheetah">{heroSubtitle}</span>
          </h1>
          <Link
            href="/book"
            className="inline-block border border-white/80 text-white px-7 py-3 text-base md:text-lg font-semibold tracking-wide hover:bg-white/10 transition"
          >
            BOOK NOW
          </Link>
        </div>
      </div>

      {announcement?.enabled && announcement?.text && (
        <div className="bg-black text-white text-center py-2">
          <span className="text-sm">{announcement.text}</span>
        </div>
      )}

      {/* About/Intro Section */}
      <Section className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="h2 mb-4">Welcome</h2>
          <p className="muted text-lg">
            Experience a relaxing, one-on-one salon visit. Transparent pricing, easy online booking, and expert care for every hair type.
          </p>
        </div>
      </Section>

      {/* Services Preview */}
      <Section className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { t: "Cuts & Styling", d: "Precision cuts, blowouts, and event styling." },
            { t: "Color & Highlights", d: "Balayage, highlights, and vibrant color." },
            { t: "Treatments", d: "Deep conditioning, repair, and smoothing." },
          ].map((x) => (
            <div key={x.t} className="card p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">{x.t}</h3>
              <p className="muted text-base">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="btn-outline">View All Services</Link>
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
      <Section className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="h2 text-center mb-12">Frequently Asked Questions</h2>
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
    .limit(5);

  const testimonials = data || [];

  if (testimonials.length === 0) return null;

  return (
    <Section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="h2 text-center mb-12">What Our Clients Say</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <div key={t.id} className="card p-6 bg-white">
              {t.rating && (
                <div className="text-brand-accent text-lg mb-3">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
              )}
              <p className="text-gray-700 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-sm font-semibold">{t.client_name}</div>
              {t.service && <div className="text-xs text-gray-500">{t.service}</div>}
            </div>
          ))}
        </div>
        
        {/* Google Reviews CTA */}
        <div className="mt-12 flex justify-center">
          <GoogleReviews />
        </div>
      </div>
    </Section>
  );
}
