export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Nav skeleton */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-canvas-soft">
        <div className="w-10 h-10 rounded-full bg-canvas-soft animate-pulse" />
        <div className="h-6 w-32 rounded-lg bg-canvas-soft animate-pulse" />
      </div>

      {/* Tab skeleton */}
      <div className="px-4 md:px-8 pt-4 pb-2 flex gap-2">
        {[72, 100, 72].map((w, i) => (
          <div key={i} className="h-9 rounded-full bg-canvas-soft animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Card skeletons — matching actual card layout */}
      <div className="px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1200px] mx-auto w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-canvas rounded-2xl flex flex-row overflow-hidden border-2 border-canvas-soft">
            {/* Left text area */}
            <div className="flex-1 p-5 flex flex-col gap-2">
              <div className="h-5 w-24 rounded bg-canvas-soft animate-pulse" />
              <div className="h-7 w-20 rounded bg-canvas-soft animate-pulse" />
              <div className="h-4 w-32 rounded bg-canvas-soft animate-pulse" />
              <div className="h-4 w-24 rounded bg-canvas-soft animate-pulse" />
              <div className="flex-1 min-h-[12px]" />
              <div className="h-10 w-20 rounded-full bg-canvas-soft animate-pulse mt-2" />
            </div>
            {/* Right photo area */}
            <div className="w-36 flex-shrink-0 bg-canvas-soft animate-pulse rounded-r-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
