import Section from "@/components/Section";

export default function ContactPage() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        <h1 className="h2 mb-12">Contact</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card p-8 md:p-12">
            <h3 className="text-2xl font-semibold mb-6">Get in touch</h3>
            <p className="text-base text-gray-700">
              Email: <a className="underline hover:text-[#C9A961] transition" href="mailto:PorschaCradic@gmail.com">PorschaCradic@gmail.com</a><br />
              Phone: <a href="tel:9136807987" className="underline hover:text-[#C9A961] transition">(913) 680-7987</a>
            </p>
          </div>
          <div className="card p-8 md:p-12">
            <h3 className="text-2xl font-semibold mb-6">Location</h3>
            <p className="text-base text-gray-700 mb-8">
              301 S 5TH ST., LEAVENWORTH, KS 66048
            </p>
            <div>
              <a
                className="btn-outline"
                href="https://www.google.com/maps/search/?api=1&query=301+S+5TH+ST+LEAVENWORTH+KS+66048"
                target="_blank" rel="noreferrer"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
