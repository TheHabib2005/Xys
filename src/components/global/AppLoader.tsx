"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const loadingTexts = [
  "Analyzing your resume...",
  "Optimizing ATS score...",
  "Matching job requirements...",
  "Almost ready..."
];

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      
      {/* Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-8"
      >

        {/* 🔷 Animated Icon Core */}
        <div className="relative flex items-center justify-center">
          
          {/* Glow Ring */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute h-28 w-28 rounded-full bg-primary/20 blur-xl"
          />

          {/* Rotating Gradient Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary via-purple-500 to-pink-500 p-[2px]"
          >
            <div className="h-full w-full rounded-2xl bg-background" />
          </motion.div>

          {/* Main Icon Box */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg"
          >
            <Zap className="h-8 w-8 text-primary-foreground" />
          </motion.div>
        </div>

        {/* 🔤 Branding + Trust Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Blitz Analyzer
          </h2>

          {/* Typing Animation */}
          <TypingText texts={loadingTexts} />

          <p className="text-xs text-muted-foreground">
            AI-powered resume intelligence
          </p>
        </div>

        {/* ⚡ Smart Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -6, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
}

/* ===============================
   ✨ Typing Animation Component
================================ */
function TypingText({ texts }: { texts: string[] }) {
  return (
    <motion.div
      key={texts[0]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-5 text-sm text-muted-foreground"
    >
      <motion.span
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {texts[0]}
      </motion.span>
    </motion.div>
  );
}