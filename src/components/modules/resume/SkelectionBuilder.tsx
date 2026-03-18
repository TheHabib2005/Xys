import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBuilder() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header Skeleton */}
      <header className="h-14 border-b px-4 flex items-center justify-between bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20 rounded-md ml-4" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 grid grid-cols-1 ">
        
        {/* Left Side: Form Skeleton */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-10">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" /> {/* Title */}
            <Skeleton className="h-4 w-48" />  {/* Subtitle */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-2xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <div className="col-span-full space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>

          {/* Navigation Bar Skeleton */}
          <div className="flex justify-between items-center mt-12">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        
       
      </main>
    </div>
  );
}