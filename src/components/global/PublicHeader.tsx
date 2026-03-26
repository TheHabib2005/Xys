"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

import Logo from "@/components/global/Logo";
import { UserRole } from "@/interfaces/enums";
import UserProfile from "../modules/auth/UserProfilePopup";
import CreditWallet from "../modules/user/UserCreditCard";

export default function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Analyzer", path: "/analysis" },
    { label: "Pricing", path: "/pricing" },
    { label: "Reviews", path: "/reviews" },
    { label: "About", path: "/about-us" },
  ];

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        // Height reduction: h-14 instead of default padding
        "h-20 flex items-center", 
        scrolled 
          ? "bg-white/70 dark:bg-[#01020c]/70 backdrop-blur-md border-b border-border/40 shadow-sm" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* LEFT: Branding */}
        <div className="scale-90 origin-left">
          <Logo />
        </div>

        {/* CENTER: Navigation (Minimalist) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "relative px-3 py-1 text-sm font-medium transition-colors rounded-lg",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="public-pill"
                    className="absolute inset-0 bg-primary/5 border-b-2 border-primary rounded-none z-[-1]"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: User Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <AnimatePresence mode="wait">
            {user ? (
              <motion.div 
                key="user-active"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                {user.user.role === UserRole.USER && (
                  <div className="scale-90">
                    <CreditWallet />
                  </div>
                )}
                <UserProfile user={user} />
              </motion.div>
            ) : (
              <motion.div 
                key="user-guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex h-8 text-xs"
                  onClick={() => router.push("/sign-in")}
                >
                  Log in
                </Button>
                <Button 
                  size="sm"
                  className="h-8 px-4 text-xs bg-primary rounded-lg shadow-md"
                  onClick={() => router.push("/sign-up")}
                >
                  Get Started
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-12 border-t border-border/50 bg-background/60 backdrop-blur-xl flex justify-around items-center">
        {navLinks.slice(0, 4).map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            className={cn(
              "text-[10px] font-bold uppercase tracking-tighter transition-colors", 
              pathname === link.path ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}