
export function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-8 w-32 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="h-10 w-full md:w-32 bg-muted rounded-xl animate-pulse" />
            <div className="h-10 w-full md:w-40 bg-muted rounded-xl animate-pulse" />
            <div className="h-10 w-full md:w-40 bg-muted rounded-xl animate-pulse" />
          </div>
        </header>

        {/* Top Stats Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border bg-card/50 p-6 md:p-8 animate-pulse">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-muted" />
              <div className="space-y-3 flex-1">
                <div className="h-8 w-48 bg-muted rounded-lg mx-auto md:mx-0" />
                <div className="h-4 w-full max-w-md bg-muted rounded-lg mx-auto md:mx-0" />
                <div className="h-4 w-3/4 bg-muted rounded-lg mx-auto md:mx-0" />
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border bg-card/50 p-6 animate-pulse">
            <div className="h-6 w-32 bg-muted rounded-lg mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-4 w-8 bg-muted rounded" />
                  </div>
                  <div className="h-2 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl w-fit">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border bg-card/50 p-6 md:p-8 animate-pulse space-y-4">
                <div className="h-8 w-48 bg-muted rounded-lg" />
                <div className="h-4 w-full bg-muted rounded-lg" />
                <div className="h-4 w-3/4 bg-muted rounded-lg" />
                <div className="h-32 w-full bg-muted rounded-xl" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-card/50 p-6 animate-pulse">
                <div className="h-6 w-32 bg-muted rounded-lg mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-6 w-16 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

