"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  MessageSquare, Heart, Share2, Bookmark, Clock, 
  MoreHorizontal, CornerDownRight, Filter, ThumbsUp, Send 
} from "lucide-react";

// ==========================================
// MOCK API SERVICES
// ==========================================

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchBlogDetails = async () => {
  await sleep(1500); // Simulate network delay for skeleton
  return {
    id: "1",
    title: "Crafting a Compelling Frontend Developer Portfolio: A Step-by-Step Guide",
    category: "Career",
    publishedAt: "2026-04-08T10:00:00Z",
    readTime: "6 min read",
    author: {
      name: "Habibur Rahman",
      role: "System Architect",
      avatar: "https://i.pravatar.cc/150?u=habib",
    },
    seoTags: ["frontend portfolio", "react", "career"],
    // Simulating HTML content returned from your database
    fullContent: `
      <p class="lead text-xl text-muted-foreground mb-8">As a junior frontend developer, having a strong portfolio is crucial for standing out in a competitive job market. A well-crafted portfolio showcases your skills, experience, and personal projects.</p>
      <h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">Defining Your Portfolio's Purpose</h2>
      <p class="mb-6 leading-relaxed">Before creating your portfolio, it's essential to define its purpose and audience. What do you want to achieve? Are you looking for a job, freelance work, or trying to attract new clients?</p>
      <blockquote class="border-l-4 border-primary pl-4 italic my-8 text-lg text-foreground/80">"Your portfolio is not just a gallery; it is a technical case study of your problem-solving abilities."</blockquote>
      <h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">Selecting and Showcasing Projects</h2>
      <p class="mb-6 leading-relaxed">Choosing the right projects to include in your portfolio is critical. Select projects that demonstrate your skills, showcase your strengths, and highlight your achievements.</p>
    `,
  };
};

const fetchComments = async () => {
  await sleep(2000);
  return [
    {
      id: "c1",
      author: { name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=sarah" },
      content: "This is exactly what I needed! I've been struggling to figure out what projects actually impress hiring managers. The Bento grid layout suggestion is fire.",
      createdAt: "2 hours ago",
      likes: 14,
      replies: [
        {
          id: "r1",
          author: { name: "Habibur Rahman", avatar: "https://i.pravatar.cc/150?u=habib", isAuthor: true },
          content: "Glad it helped, Sarah! Make sure to deploy them and include live links.",
          createdAt: "1 hour ago",
          likes: 3,
        }
      ]
    },
    {
      id: "c2",
      author: { name: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=alex" },
      content: "Do you recommend using Next.js for a simple portfolio, or is it overkill? I'm currently using plain React (Vite).",
      createdAt: "5 hours ago",
      likes: 8,
      replies: []
    }
  ];
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function BlogDetailsPage() {
  const { data: blog, isLoading: isBlogLoading } = useQuery({
    queryKey: ["blog", "slug"],
    queryFn: fetchBlogDetails,
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Premium Hero/Header Section */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        {isBlogLoading ? (
          <BlogHeaderSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <span className="bg-primary/10 px-3 py-1 rounded-full">{blog?.category}</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" /> {blog?.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance leading-tight">
              {blog?.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-b border-border">
              <div className="flex items-center gap-4">
                <img src={blog?.author.avatar} alt="Author" className="w-12 h-12 rounded-full border-2 border-background shadow-sm" />
                <div>
                  <p className="font-semibold text-foreground text-base">{blog?.author.name}</p>
                  <p className="text-sm text-muted-foreground">{blog?.author.role} • {new Date(blog?.publishedAt!).toLocaleDateString()}</p>
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
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        {isBlogLoading ? (
          <BlogContentSkeleton />
        ) : (
          <article 
            className="text-lg leading-loose text-foreground/90 pb-16 border-b border-border"
            dangerouslySetInnerHTML={{ __html: blog?.fullContent || "" }} 
          />
        )}
      </main>

      {/* Comments Section */}
      <section className="bg-muted/20 border-t border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <CommentsSection />
        </div>
      </section>
    </div>
  );
}

// ==========================================
// COMMENTS SECTION COMPONENT
// ==========================================

function CommentsSection() {
  const [filter, setFilter] = useState("Top");
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", "blogId"],
    queryFn: fetchComments,
  });

  return (
    <div className="space-y-10">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          Discussion <span className="text-muted-foreground font-normal text-lg">({comments?.length || 0})</span>
        </h3>
        <div className="flex items-center gap-2 bg-background border border-border p-1 rounded-lg shadow-sm">
          {["Top", "Newest", "Oldest"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === f 
                  ? "bg-secondary text-secondary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* New Comment Form (Premium Glassmorphic Input) */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex gap-4 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
        <img src="https://i.pravatar.cc/150?u=currentUser" alt="You" className="w-10 h-10 rounded-full hidden sm:block" />
        <div className="flex-1 space-y-3">
          <textarea 
            placeholder="Share your thoughts on this post..."
            className="w-full bg-transparent border-none outline-none resize-none min-h-[80px] text-base placeholder:text-muted-foreground"
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">Markdown is supported</span>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-95">
              <Send className="w-4 h-4" /> Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <CommentsSkeleton />
        ) : (
          comments?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// INDIVIDUAL COMMENT COMPONENT
// ==========================================

function CommentItem({ comment }: { comment: any }) {
  return (
    <div className="group">
      <div className="flex gap-4 p-4 sm:p-5 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
        <img src={comment.author.avatar} alt={comment.author.name} className="w-10 h-10 rounded-full border border-border" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{comment.author.name}</span>
                {comment.author.isAuthor && (
                  <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Author</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-foreground/90 text-sm leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" /> {comment.likes}
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="w-4 h-4" /> Reply
            </button>
          </div>
        </div>
      </div>

      {/* Nested Replies Rendering */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-8 sm:ml-12 pl-4 border-l-2 border-border/50 space-y-4">
          {comment.replies.map((reply: any) => (
            <div key={reply.id} className="flex gap-3">
              <CornerDownRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
              <div className="flex-1">
                <CommentItem comment={reply} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// SKELETON LOADERS
// ==========================================

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

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse flex gap-4 p-5 bg-background border border-border rounded-xl">
          <div className="w-10 h-10 bg-muted rounded-full shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="w-32 h-4 bg-muted rounded"></div>
            <div className="w-full h-16 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}