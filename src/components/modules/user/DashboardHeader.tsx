"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Upload,
  Sun,
  Moon,
  Bolt
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import UserProfile from "../auth/UserProfilePopup";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Dashboard", path: "/profile" },
    { label: "Upload", path: "/upload" },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-xl border-b",
        "border-b border-border/60  bg-[#f3f3f3] dark:bg-[#01020c]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* 🔷 LEFT: Logo + Sidebar */}
        <div className="flex items-center gap-3">

          <SidebarTrigger className="h-9 w-9 rounded-xl border bg-background/50 hover:bg-accent transition" />

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Bolt className="h-5 w-5 text-primary" />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Blitz Analyzer
              </span>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* 🔶 CENTER: Navigation */}
        <nav className="hidden md:flex items-center gap-2 relative">

          {navLinks.map((link) => {
            const active = pathname === link.path;

            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-lg transition",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* 🔷 RIGHT: Actions */}
        <div className="flex items-center gap-2">

          {/* CTA */}
          <Button
            size="sm"
            onClick={() => router.push("/upload")}
            className="hidden sm:flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Upload className="h-4 w-4" />
            New Analysis
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* User */}
          {user ? (
            <UserProfile user={user} />
          ) : (
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* 📱 Mobile Bottom Nav */}
      <div className="md:hidden border-t border-border/50 flex justify-around py-2 bg-background/80 backdrop-blur">
        {navLinks.map((link) => {
          const active = pathname === link.path;

          return (
            <button
              key={link.path}
              onClick={() => router.push(link.path)}
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-md",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}