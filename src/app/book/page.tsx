import dynamic from "next/dynamic";
import Section from "@/components/Section";
const GlossGeniusWidget = dynamic(() => import("@/components/GlossGeniusWidget"), { ssr: false });

export default function BookPage() {
  return (
    <Section>
      <h1 className="h2">Book an Appointment</h1>
      <p className="mt-2 muted">Instant confirmation, email/SMS reminders.</p>
      <div className="mt-6 card p-4">
        <GlossGeniusWidget />
      </div>
    </Section>
  );
}
