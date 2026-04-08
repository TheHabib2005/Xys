"use client"
import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { BlogSkeleton } from './BlogSkelection';
import { BlogCard } from './BlogCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const BlogListing = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mock Role - In production, get this from your Auth context/store
  const currentUserRole = "MANAGER"; 

  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';

  const { data, isLoading, isFetching } = useApiQuery(
    ["blog-list-fetch", page, status],
    `/blog?page=${page}&limit=8&${status && `status=${status}` }`,
    "axios"
  );

  const blogs = data?.data?.data || [];
  const meta = data?.data?.meta || { totalPages: 1 };

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value && value !== 'ALL' ? params.set(key, value) : params.delete(key);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 min-h-screen">
      
      {/* --- Modern Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-1">
            <LayoutGrid className="w-4 h-4" /> Journal
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Explore Blogs</h1>
        </div>

        <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-xl">
          {['ALL', 'PUBLISHED', 'DRAFT'].map((s) => (
            <button
              key={s}
              onClick={() => updateParams('status', s)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                status === s 
                ? 'bg-background text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
         <Button  variant={"default"}> <Link href={"/moderator/dashboard/manage-blogs/create"}>Create Blog</Link></Button>
        </div>
      </div>

      {/* --- Blog Grid --- */}
      {(isLoading || isFetching) ? (
        <BlogSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} role={currentUserRole} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- Modern Pagination --- */}
      {!isLoading && blogs.length > 0 && (
        <div className="flex justify-center items-center gap-2 pt-12">
          <button
            disabled={page === 1}
            onClick={() => updateParams('page', String(page - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border hover:bg-primary hover:text-white disabled:opacity-20 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-3xl border border-border/40">
            {[...Array(meta.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => updateParams('page', String(i + 1))}
                className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-300 ${
                  page === i + 1 
                  ? 'bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === meta.totalPages}
            onClick={() => updateParams('page', String(page + 1))}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border hover:bg-primary hover:text-white disabled:opacity-20 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListing;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-3 pt-16">
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.9 }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-14 h-14 flex items-center justify-center rounded-3xl bg-card border border-border hover:bg-primary hover:text-primary-foreground disabled:opacity-20 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/20 backdrop-blur-md rounded-[2rem] border border-border/50">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;
          
          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              className="relative w-12 h-12 flex items-center justify-center group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activePage"
                  className="absolute inset-0 bg-primary rounded-2xl shadow-xl shadow-primary/30"
                />
              )}
              <span className={`relative z-10 text-sm font-black transition-colors duration-300 ${
                isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {pageNum}
              </span>
            </button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.9 }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-14 h-14 flex items-center justify-center rounded-3xl bg-card border border-border hover:bg-primary hover:text-primary-foreground disabled:opacity-20 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
};