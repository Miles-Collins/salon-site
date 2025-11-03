import Link from "next/link";

export default function BookPage() {
  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-6">Book Your Appointment</h1>
        <p className="text-lg text-black/70 mb-8">
          Ready to transform your look? Click below to view services and book your appointment through our secure booking system.
        </p>
        <Link
          href="https://porschacradic.glossgenius.com/services"
          className="btn-accent inline-block px-8 py-4 text-lg"
          target="_blank"
          rel="noreferrer"
        >
          Book Now on GlossGenius
        </Link>
        <p className="text-sm text-black/60 mt-6">
          You'll be redirected to our secure booking page
        </p>
      </div>
    </section>
  );
}
