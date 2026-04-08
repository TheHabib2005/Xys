"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain, Menu, Moon, Sun, X, FileText, BarChart3, MessageSquare,
  LayoutDashboard, Shield, Settings, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Bento Grid Background ─── */
export const BentoGridBg = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="bento-grid-bg absolute inset-0 opacity-40" />
    <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-chart-4/5 blur-[100px]" />
    <div className="absolute top-[40%] right-[20%] h-[300px] w-[300px] rounded-full bg-chart-2/5 blur-[80px]" />
  </div>
);

/* ─── Section Heading ─── */
export const SectionHeading = ({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mx-auto mb-12 max-w-2xl text-center"
  >
    {badge && (
      <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
        {badge}
      </span>
    )}
    <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
    <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
  </motion.div>
);

/* ─── Navbar ─── */
const navLinks = [
  { to: "/", label: "Home", icon: Brain },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/blogs", label: "Blog", icon: BarChart3 },
  { to: "/issues", label: "Issues", icon: MessageSquare },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/dashboard", label: "Admin", icon: Shield },
  { to: "/manager/dashboard", label: "Manager", icon: Settings },
];

export const Navbar = () => {
  const pathname = usePathname(); // Next.js hook for current route
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">ResumeAI</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex gap-1.5" asChild>
             <Link href="/get-started">
                <Sparkles className="h-4 w-4" /> Get Started
             </Link>
          </Button>
          {/* Next.js tip: use 'next-themes' for a robust dark mode toggle */}
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            <Sun className="h-5 w-5 block dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ─── Footer ─── */
export const Footer = () => (
  <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ResumeAI</span>
          </div>
          <p className="text-sm text-muted-foreground">AI-powered resume analysis for modern job seekers.</p>
        </div>
        {[
          { title: "Product", items: ["Features", "Templates", "Pricing", "Changelog"] },
          { title: "Company", items: ["About", "Blog", "Careers", "Contact"] },
          { title: "Legal", items: ["Privacy", "Terms", "Security", "Status"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2">
              {col.items.map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResumeAI. All rights reserved.
      </div>
    </div>
  </footer>
);

/* ─── Animated Card Wrapper ─── */
export const AnimatedCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`rounded-2xl border border-border/50 bg-card/80 p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── Skeleton Card ─── */
export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm ${className}`}>
    <div className="mb-4 h-40 w-full animate-pulse rounded-xl bg-muted" />
    <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
    <div className="mb-4 h-3 w-1/2 animate-pulse rounded bg-muted" />
    <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
  </div>
);

/* ─── Page Layout ─── */
export const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Navbar />
    <BentoGridBg />
    <main>{children}</main>
    <Footer />
  </div>
);