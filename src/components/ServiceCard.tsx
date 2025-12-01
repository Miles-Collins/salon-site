import Link from "next/link";

export default function ServiceCard(
  { name, price, time, desc, slug }: { name: string; price: number; time: string; desc: string; slug?: string }
) {
  const CardContent = (
    <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col justify-between min-h-[170px] hover:border-gold transition-colors">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-light tracking-wide text-black">{name}</h3>
          <span className="text-2xl font-bold text-black/80">${price}</span>
        </div>
        <p className="text-sm text-black/60 mb-2">{desc}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-black/40">{time}</div>
        {slug && (
          <div className="text-xs text-gold font-medium">Learn more →</div>
        )}
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/services/${slug}`}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
