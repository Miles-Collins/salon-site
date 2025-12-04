import Link from "next/link";

export default function BookPage() {
  return (
    <section className="py-32 md:py-40">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-8">Book Your Appointment</h1>
        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
          Ready to transform your look? Click below to view services and book your appointment through our secure booking system.
        </p>
        <Link
          href="https://porschacradic.glossgenius.com/services"
          className="btn-accent inline-block px-10 py-4 text-lg font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Now on GlossGenius
        </Link>
        <p className="text-base text-gray-600 mt-8">
          You&apos;ll be redirected to our secure booking page
        </p>
      </div>
    </section>
  );
}
