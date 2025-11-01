import Link from "next/link";
import Section from "@/components/Section";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <Section className="pt-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="h1">
              Effortless beauty, <span className="text-brand-accent">made simple.</span>
            </h1>
            <p className="muted text-lg">
              Personalized cuts, color, and treatments by Porscha. Book online in seconds and get
              SMS/email reminders.
            </p>
            <div className="flex gap-3">
              <Link href="/book" className="btn-accent">Book an Appointment</Link>
              <Link href="/services" className="btn-outline">View Services</Link>
            </div>
            <ul className="grid gap-2 text-sm text-black/70">
              <li>• Clean, modern studio</li>
              <li>• Transparent pricing & duration</li>
              <li>• Contactless payments</li>
            </ul>
          </div>
          <div className="card overflow-hidden">
            <div className="h-80 w-full bg-gradient-to-br from-brand/10 to-brand-accent/10 flex items-center justify-center">
              <p className="text-brand/40 text-lg font-medium">Salon Preview</p>
            </div>
          </div>
        </div>
      </Section>

      {/* QUICK BLURBS */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { t: "Cuts & Styling", d: "From refresh trims to event styling." },
            { t: "Color & Highlights", d: "Dimensional color tailored to you." },
            { t: "Treatments", d: "Hydration and repair add-ons." },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <h3 className="text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-black/70">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="card p-8 text-center">
          <h2 className="h2">Ready to book?</h2>
          <p className="mt-2 muted">Pick a time that works for you. Confirmation is instant.</p>
          <div className="mt-6">
            <Link href="/book" className="btn-accent">Book Now</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
