import { Skeleton } from '@/components/ui/skeleton';

export function EditorSkeleton() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background animate-fade-in">
      {/* Top nav */}
      <div className="h-14 border-b border-border bg-card flex items-center px-5 gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>

      {/* Toolbar */}
      <div className="h-10 border-b border-border bg-card flex items-center px-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-7 rounded-md" />
        ))}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[240px] shrink-0 border-r border-border bg-card p-4 space-y-2">
          <Skeleton className="h-8 w-full rounded-md mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-canvas-bg flex justify-center py-10 px-6">
          <div className="w-[794px] bg-canvas-paper shadow-sm rounded p-14 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-px w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[260px] shrink-0 border-l border-border bg-card p-4 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-px w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
