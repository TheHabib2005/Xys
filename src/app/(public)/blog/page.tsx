import { Suspense } from "react";
import BlogListingContent from "./blogs.tsx";

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-[16/10] w-full bg-slate-200 animate-pulse rounded-none" />
          <div className="space-y-3 p-4">
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
            </div>
            <div className="h-6 w-5/6 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
              <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogGridSkeleton />}>
      <BlogListingContent />
    </Suspense>
  );

}
