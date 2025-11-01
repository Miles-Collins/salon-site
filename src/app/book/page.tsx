import Link from "next/link";

export default function BookPage() {
  return (
    <section className="space-y-6">
      <div className="card p-8 mt-10 text-center">
        <Link
          href="https://porschacradic.glossgenius.com/services"
          className="btn-accent"
          target="_blank"
          rel="noreferrer"
        >
          Open Booking
        </Link>
      </div>
    </section>
  );
}
