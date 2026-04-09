"use client";
import { getBlogDetails } from "@/services/blog.services";
import { useQuery } from "@tanstack/react-query";
import { 
  Bookmark, 
  Clock, 
  Share2, 
  FileQuestion, 
  ArrowLeft, 
  Home 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogDetails({ id }: { id: string }) {
  const { data: blog, isLoading: isBlogLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogDetails(id),
  });

  // Check if data is null, undefined, or empty
  const noBlogData = !isBlogLoading && (!blog || !blog.data);

  if (noBlogData || isError) {
    return <EmptyStateUI />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Premium Hero/Header Section */}
      {id}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        {isBlogLoading ? (
          <BlogHeaderSkeleton />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <span className="bg-primary/10 px-3 py-1 rounded-full">
                {blog?.data.category || "Uncategorized"}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" /> {blog?.data.readTime || 10} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance leading-tight">
              {blog?.data.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-b border-border">
              <div className="flex items-center gap-4">
                <img
                  src={blog?.data.author?.avatar || "https://avatar.iran.liara.run/public"}
                  alt="Author"
                  className="w-12 h-12 rounded-full border-2 border-background shadow-sm object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground text-base">
                    {blog?.data.author?.name || "Unknown Author"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {blog?.data.author?.role || "Contributor"} •{" "}
                    {blog?.data.publishedAt 
                      ? new Date(blog.data.publishedAt).toLocaleDateString() 
                      : "Recently"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        {isBlogLoading ? (
          <BlogContentSkeleton />
        ) : (
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 pb-16 border-b border-border"
            dangerouslySetInnerHTML={{ __html: blog?.data.fullContent || "" }}
          />
        )}
      </main>
    </div>
  );
}

// --- Empty State Component ---
function EmptyStateUI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="inline-flex p-4 rounded-2xl bg-muted text-muted-foreground">
          <FileQuestion className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Post Not Found</h2>
          <p className="text-muted-foreground text-balance">
            The article you are looking for might have been moved, deleted, or never existed in the first place.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
          <Link 
            href="/blogs" 
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// --- Skeleton Components ---
function BlogHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="w-24 h-6 bg-muted rounded-full"></div>
      <div className="w-full h-12 bg-muted rounded-lg"></div>
      <div className="w-2/3 h-12 bg-muted rounded-lg"></div>
      <div className="flex items-center justify-between py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-muted rounded"></div>
            <div className="w-24 h-3 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="w-full h-4 bg-muted rounded"></div>
      <div className="w-full h-4 bg-muted rounded"></div>
      <div className="w-5/6 h-4 bg-muted rounded"></div>
      <div className="w-3/4 h-8 bg-muted rounded mt-10 mb-4"></div>
      <div className="w-full h-4 bg-muted rounded"></div>
      <div className="w-full h-4 bg-muted rounded"></div>
    </div>
  );
}