import Section from "@/components/Section";

export default function AboutPage() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        <h1 className="h2 mb-8">About Porscha</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
          Porscha specializes in personalized cuts, color, and healthy-hair treatments with a focus on
          wearable, low-maintenance looks.
        </p>
        <div className="card p-8 md:p-12">
          <h3 className="text-2xl font-semibold mb-6">Approach</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Consultation-first, texture-aware, and product-smart — so your style looks great in the chair
            and at home.
          </p>
        </div>
      </div>
    </Section>
  );
}
