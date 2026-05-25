export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Nav skeleton */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-canvas-soft">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="h-6 w-32 rounded-lg skeleton-shimmer" />
      </div>

      {/* Tab skeleton */}
      <div className="px-4 md:px-8 pt-4 pb-2 flex gap-2">
        {[72, 100, 72].map((w, i) => (
          <div key={i} className="h-9 rounded-full skeleton-shimmer" style={{ width: w }} />
        ))}
      </div>

      {/* Card skeletons */}
      <div className="px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1200px] mx-auto w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden flex"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            {/* Left content area */}
            <div className="flex-[3] p-5 flex flex-col gap-3">
              <div className="skeleton-shimmer h-4 w-24 rounded-full" />
              <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
              <div className="skeleton-shimmer h-4 w-40 rounded-lg" />
              <div className="skeleton-shimmer h-4 w-28 rounded-lg" />
              <div className="skeleton-shimmer h-9 w-24 rounded-full mt-2" />
            </div>
            {/* Right photo area */}
            <div className="w-36 flex-shrink-0 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
