export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Nav skeleton */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-canvas-soft">
        <div className="w-10 h-10 rounded-full bg-canvas-soft animate-pulse" />
        <div className="h-6 w-36 rounded-lg bg-canvas-soft animate-pulse" />
      </div>

      {/* Two-column candidate header skeleton */}
      <div className="border-b border-canvas-soft w-full">
        <div className="grid grid-cols-2 divide-x divide-canvas-soft max-w-[1200px] mx-auto">
          {[0, 1].map((col) => (
            <div key={col} className="px-4 md:px-6 py-4 flex flex-col gap-2">
              <div className="h-4 w-20 rounded bg-canvas-soft animate-pulse" />
              {/* Photo skeleton */}
              <div className="w-full aspect-[3/4] rounded-xl bg-canvas-soft animate-pulse" />
              <div className="h-4 w-28 rounded bg-canvas-soft animate-pulse" />
              <div className="h-4 w-32 rounded bg-canvas-soft animate-pulse" />
              {/* Chips */}
              <div className="flex gap-1">
                {[52, 52].map((w, i) => (
                  <div key={i} className="h-6 rounded-full bg-canvas-soft animate-pulse" style={{ width: w }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section heading skeleton */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <div className="h-7 w-32 rounded bg-canvas-soft animate-pulse" />
      </div>

      {/* Pledge card row skeletons */}
      <section className="flex-1 pb-12 max-w-[1200px] mx-auto w-full px-3 md:px-5">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-canvas-soft animate-pulse" style={{ height: '140px' }} />
              <div className="rounded-2xl bg-canvas-soft animate-pulse" style={{ height: '140px' }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
