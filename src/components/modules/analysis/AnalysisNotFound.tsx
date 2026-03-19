import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, FileWarning, RotateCcw } from "lucide-react";
import {motion } from "framer-motion"
// Not Found Component
export function AnalysisNotFound({ onRetry }: { onRetry?: () => void }) {
 return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* subtle gradient glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="text-6xl mb-4">🔍</div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Analysis Not Found
          </h2>

          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            The analysis you're looking for doesn’t exist or may have expired.
            Try going back to your dashboard or re-running the analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
}

// Error Component
export function AnalysisError({ onRetry }: { onRetry?: () => void }) {
  return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Failed to load analysis
          </h2>

          <p className="text-gray-500 mt-2">
            Please check your connection or try again.
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
}

// Badge Component
export function Badge({ 
  children, 
  variant = "info", 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
}) {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };
  
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}