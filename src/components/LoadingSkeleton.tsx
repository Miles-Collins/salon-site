export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="skeleton-loading h-6 w-3/4 rounded"></div>
          <div className="skeleton-loading h-4 w-full rounded"></div>
          <div className="skeleton-loading h-4 w-5/6 rounded"></div>
        </div>
      ))}
    </div>
  );
}
