export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Nav skeleton */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-canvas-soft">
        <div className="w-10 h-10 rounded-full bg-canvas-soft animate-pulse" />
        <div className="h-6 w-28 rounded-lg bg-canvas-soft animate-pulse" />
      </div>

      {/* Profile skeleton */}
      <section className="px-4 md:px-8 pt-6 pb-4 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-row gap-4">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-2 py-2">
            <div className="h-4 w-16 rounded bg-canvas-soft animate-pulse" />
            <div className="h-8 w-28 rounded bg-canvas-soft animate-pulse" />
            <div className="h-4 w-32 rounded bg-canvas-soft animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-canvas-soft animate-pulse" />
          </div>
          {/* Right photo */}
          <div className="w-32 flex-shrink-0 rounded-xl bg-canvas-soft animate-pulse" style={{ minHeight: '128px' }} />
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Info rows */}
        <div className="flex flex-col gap-2 pb-2">
          {[140, 180, 200, 160].map((w, i) => (
            <div key={i} className="h-4 rounded bg-canvas-soft animate-pulse" style={{ width: w }} />
          ))}
        </div>

        {/* 주요 공약 chips */}
        <div className="flex gap-1 mt-3">
          {[52, 52, 60].map((w, i) => (
            <div key={i} className="h-6 rounded-full bg-canvas-soft animate-pulse" style={{ width: w }} />
          ))}
        </div>
      </section>

      {/* Section heading skeleton */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <div className="h-7 w-24 rounded bg-canvas-soft animate-pulse" />
      </div>

      {/* Pledge card skeletons */}
      <section className="flex-1 px-4 md:px-8 pt-2 pb-28 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-canvas-soft animate-pulse"
              style={{ height: '140px' }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
