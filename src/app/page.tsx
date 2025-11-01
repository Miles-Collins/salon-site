import Link from "next/link";
import Section from "@/components/Section";
import Image from "next/image";
import heroImg from "../../public/hero.jpg";

export default function HomePage() {
  return (
    <>
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
  <div className="relative z-10 text-center w-full px-4 md:px-4 flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-8">
            <span className="block text-outline-white font-light tracking-wide">HAIR BY</span>
            <span className="block text-cheetah">PORSCHA</span>
          </h1>
          <Link
            href="/book"
            className="inline-block border border-white/80 text-white px-7 py-3 text-base md:text-lg font-semibold tracking-wide hover:bg-white/10 transition"
          >
            BOOK NOW
          </Link>
        </div>
      </div>

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

      {/* Contact/Location Section */}
      <Section className="py-12">
        <div className="max-w-2xl mx-auto card p-8 text-center">
          <h2 className="h2 mb-2">Contact & Location</h2>
          <p className="muted mb-4">Text or email for questions, or book online anytime.</p>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Email:</span> <a href="mailto:hello@porscha.salon" className="text-brand-accent underline">hello@porscha.salon</a>
            </div>
            <div>
              <span className="font-semibold">Phone:</span> <a href="tel:5551234567" className="text-brand-accent underline">(555) 123-4567</a>
            </div>
            <div>
              <span className="font-semibold">Location:</span> <a href="https://maps.google.com/?q=Your+Salon+Address" target="_blank" rel="noopener" className="text-brand-accent underline">123 Main St, Your City</a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
