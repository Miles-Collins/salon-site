import dynamic from "next/dynamic";
import Section from "@/components/Section";
const GlossGeniusWidget = dynamic(() => import("@/components/GlossGeniusWidget"), { ssr: false });

export default function BookPage() {
  return (
    <Section>
      <h1 className="h2">Book with Porscha</h1>
      <p className="mt-2 muted">
        You’ll see live availability, instant confirmation, and automatic reminders.
      </p>
      <div className="mt-6 card p-4">
        <GlossGeniusWidget />
      </div>
    </Section>
  );
}
