export default function ServiceCard(
  { name, price, time, desc }: { name: string; price: number; time: string; desc: string }
) {
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-brand/80">${price}</span>
      </div>
      <p className="mt-2 text-sm text-black/70">{desc}</p>
      <p className="mt-1 text-xs text-black/50">Duration: {time}</p>
    </div>
  );
}
