import GlossGeniusWidget from "@/components/GlossGeniusWidget";
import Section from "@/components/Section";

export default function BookPage() {
  return (
    <Section>
      <h1 className="h2">Book with Porscha</h1>
      <div className="card p-4 mt-6">
        <GlossGeniusWidget />
      </div>
    </Section>
  );
}
