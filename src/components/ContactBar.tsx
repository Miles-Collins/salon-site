import Link from "next/link";

export default function ContactBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-brand/10 shadow-soft z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <a href="tel:9136807987" className="font-semibold text-brand hover:text-brand-accent transition whitespace-nowrap">(913) 680-7987</a>
          <span className="text-black/30 hidden sm:inline">|</span>
          <a href="mailto:PorschaCradic@gmail.com" className="font-semibold text-brand hover:text-brand-accent transition whitespace-nowrap text-xs sm:text-sm">PorschaCradic@gmail.com</a>
        </div>
        <Link href="/book" className="btn-accent px-4 py-2 rounded-full text-sm font-semibold shadow-soft whitespace-nowrap">Book Now</Link>
      </div>
    </div>
  );
}
