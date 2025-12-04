import Section from "@/components/Section";
import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About Porscha",
  description: "Meet Porscha - Licensed professional hair stylist with 15+ years experience. Specialized training in color, cutting, and texture. Certified in advanced techniques and hair health treatments.",
  openGraph: {
    title: "About Porscha | Color Rebel by Porscha",
    description: "Licensed professional with 15+ years experience. Specialized in color, cutting, and all hair textures.",
    url: "https://colorrebelbyporscha.com/about",
    images: [{ url: "/api/og?page=about", width: 1200, height: 630, alt: "About Porscha" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" }
      ]} />
      <Section>
        <div className="max-w-4xl mx-auto">
        <h1 className="h2 mb-8">About Porscha</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
          Porscha specializes in personalized cuts, color, and healthy-hair treatments with a focus on
          wearable, low-maintenance looks.
        </p>

        {/* Trust Elements Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Licensed Professional</h3>
            <p className="text-sm text-gray-600">State-certified cosmetologist with specialized training in advanced color techniques</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">15+ Years Experience</h3>
            <p className="text-sm text-gray-600">Over a decade of creating beautiful, healthy hair transformations</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Premium Products</h3>
            <p className="text-sm text-gray-600">Exclusive use of professional-grade, cruelty-free hair care products</p>
          </div>
        </div>

        {/* Certifications & Training */}
        <div className="card p-8 md:p-10 mb-12 bg-gradient-to-br from-white to-gray-50">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">Certifications & Training</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-[#C9A961] text-xl mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Advanced Color Specialist</p>
                <p className="text-sm text-gray-600">Balayage, highlights, and color correction</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-[#C9A961] text-xl mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Texture Expert</p>
                <p className="text-sm text-gray-600">Specialized in all hair types and textures</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-[#C9A961] text-xl mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Precision Cutting</p>
                <p className="text-sm text-gray-600">Modern techniques for every style</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-[#C9A961] text-xl mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Hair Health Specialist</p>
                <p className="text-sm text-gray-600">Treatments for damaged and chemical hair</p>
              </div>
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="card p-8 md:p-12">
          <h3 className="text-2xl font-semibold mb-6">Approach</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Consultation-first, texture-aware, and product-smart — so your style looks great in the chair
            and at home.
          </p>
          </div>
        </div>
      </Section>
    </>
  );
}