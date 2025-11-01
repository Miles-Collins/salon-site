import Section from "@/components/Section";

export default function AboutPage() {
  return (
    <Section>
      <h1 className="h2">About Porscha</h1>
      <p className="mt-3 muted">
        Porscha specializes in personalized cuts, color, and healthy-hair treatments with a focus on
        wearable, low-maintenance looks.
      </p>
      <div className="mt-8 card p-6">
        <h3 className="text-lg font-semibold">Approach</h3>
        <p className="mt-2 text-sm text-black/70">
          Consultation-first, texture-aware, and product-smart — so your style looks great in the chair
          and at home.
        </p>
      </div>
    </Section>
  );
}
