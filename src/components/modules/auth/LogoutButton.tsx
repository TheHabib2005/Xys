"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Assuming you have the standard shadcn utility
import { handleLogout } from "@/services/auth.services";

interface LogoutButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "subtle";
}

const LogoutButton = ({ className, variant = "subtle" }: LogoutButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    
    try {
      const result = await handleLogout();
      
      if (result?.success) {
        toast.success(result?.message || "Logged out successfully");
        // Clear local cache and redirect
        router.push("/sign-in");
        router.refresh(); 
      } else {
        toast.error(result?.message || "Failed to logout");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Modern SaaS styles based on the variant
  const variants = {
    subtle: "hover:bg-destructive/10 text-destructive hover:text-destructive",
    ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
    outline: "border border-border hover:bg-destructive/5 text-destructive",
  };

  return (
    <button
      onClick={onLogout}
      disabled={isLoading}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      <div className="flex items-center justify-center shrink-0">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        )}
      </div>
      
      <span className="flex-1 text-left">
        {isLoading ? "Signing out..." : "Logout"}
      </span>

      {/* Subtle indicator for desktop hover */}
      {!isLoading && (
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Esc
        </kbd>
      )}
    </button>
  );
};

export default LogoutButton;