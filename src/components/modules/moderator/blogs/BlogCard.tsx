"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { User, ArrowUpRight, Eye, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export const BlogCard = ({ blog, role }: { blog: any, role: string }) => {
  const router = useRouter();
  const isManager = role === "MANAGER";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-card border-[0.5px] border-border/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[16/11] overflow-hidden m-3 rounded-[2rem]">
        <img 
          src={blog.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"} 
          alt={blog.title}
          className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Glass Overlay for Users */}
        {!isManager && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/blog/${blog.slug}`)}
              className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
            >
              Read Article <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Floating Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={`backdrop-blur-xl border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${
            blog.status === 'PUBLISHED' 
            ? 'bg-emerald-500/80 text-white' 
            : 'bg-orange-500/80 text-white'
          }`}>
            {blog.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 pt-2 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
            {blog.category}
          </span>
          <div className="h-[1px] flex-1 bg-border/40" />
        </div>

        <h3 className="font-bold text-xl md:text-2xl line-clamp-2 leading-[1.2] mb-4 group-hover:text-primary transition-colors duration-300">
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed font-medium opacity-80">
          {blog.excerpt}
        </p>
        
        <div className="mt-auto flex items-center justify-between gap-4">
          {isManager ? (
            <div className="flex items-center gap-3 bg-secondary/30 p-1 pr-4 rounded-full border border-border/40">
               <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author.name}`} alt="avatar" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Author</span>
                 <span className="text-xs font-black">{blog.author.name}</span>
               </div>
            </div>
          ) : (
             <div className="flex items-center gap-2 text-muted-foreground">
               <CalendarDays className="w-4 h-4" />
               <span className="text-xs font-bold tracking-tight">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
             </div>
          )}

          {isManager && (
            <button 
              onClick={() => router.push(`/blog/${blog.slug}`)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-90"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};