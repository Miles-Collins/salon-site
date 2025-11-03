import Section from "@/components/Section";

export default function ContactPage() {
  return (
    <Section>
      <h1 className="h2">Contact</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Get in touch</h3>
          <p className="mt-2 text-sm text-black/70">
            Email: <a className="underline" href="mailto:hello@hairbyporscha.com">hello@hairbyporscha.com</a><br />
            Phone: (913) 680-7987
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Location</h3>
          <p className="mt-2 text-sm text-black/70">
            301 S 5TH ST., LEAVENWORTH, KS 66048
          </p>
          <div className="mt-4">
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
    </Section>
  );
}
