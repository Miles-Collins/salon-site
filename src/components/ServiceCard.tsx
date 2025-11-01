export default function ServiceCard(
  { name, price, time, desc }: { name: string; price: number; time: string; desc: string }
) {
  return (
    <div className="bg-white border border-black/10 rounded-xl shadow-sm p-6 flex flex-col justify-between min-h-[170px]">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-light tracking-wide text-black">{name}</h3>
          <span className="text-2xl font-bold text-black/80">${price}</span>
        </div>
        <p className="text-sm text-black/60 mb-2">{desc}</p>
      </div>
      <div className="text-xs text-black/40 mt-2 text-right">{time}</div>
    </div>
  );
}
