export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Nav skeleton */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-canvas-soft">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="h-6 w-36 rounded-lg skeleton-shimmer" />
      </div>

      {/* Content */}
      <div className="flex-1 px-3 md:px-5 pt-4 pb-12 max-w-[1200px] mx-auto w-full">
        {/* 2-column candidate header */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="skeleton-shimmer rounded-2xl h-48" />
          <div className="skeleton-shimmer rounded-2xl h-48" />
        </div>

        {/* Pledge rows */}
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="grid grid-cols-2 gap-2 mb-2">
            <div className="skeleton-shimmer rounded-2xl h-24" />
            <div className="skeleton-shimmer rounded-2xl h-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
