import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";

const services = [
  { name: "Women's Cut", price: 65, time: "45–60 min", desc: "Wash, cut, style." },
  { name: "Men's Cut", price: 45, time: "30–45 min", desc: "Wash, cut, style." },
  { name: "Root Touch-Up", price: 85, time: "60–75 min", desc: "Gray coverage or root refresh." },
  { name: "Full Color", price: 140, time: "120 min", desc: "Single-process full color." },
  { name: "Partial Highlights", price: 160, time: "120–150 min", desc: "Dimensional lightening." },
  { name: "Deep Treatment", price: 40, time: "20 min", desc: "Repair & hydration add-on." },
];

export default function ServicesPage() {
  return (
    <Section>
      <h1 className="h2">Services & Hours</h1>
      <p className="mt-2 muted">Pricing may vary by hair length/density.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => <ServiceCard key={s.name} {...s} />)}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Hours</h3>
          <ul className="mt-3 text-sm text-black/70">
            <li>Mon–Fri: 10:00a–6:00p</li>
            <li>Sat: 9:00a–3:00p</li>
            <li>Sun: Closed</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Booking</h3>
          <p className="mt-2 text-sm text-black/70">Book online — instant confirmation & reminders.</p>
          <Link href="/book" className="mt-4 inline-block btn-accent">Book Now</Link>
        </div>
      </div>
    </Section>
  );
}
