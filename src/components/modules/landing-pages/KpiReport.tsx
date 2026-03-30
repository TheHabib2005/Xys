"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  FileText,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const KPISReports = () => {
  const { data: kpis, isLoading } = useApiQuery(
    ["get-kpis"],
    "/user/public/kpis",
    "axios"
  );

  const stats = [
    {
      title: "Total Users",
      value: kpis?.data?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      solid: "bg-blue-500",
    },
    {
      title: "Verified Users",
      value: kpis?.data?.verifiedUsers || 0,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      solid: "bg-emerald-500",
    },
    {
      title: "Total Analyses",
      value: kpis?.data?.totalAnalyses || 0,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      solid: "bg-purple-500",
    },
    {
      title: "Total Resumes",
      value: kpis?.data?.totalResumes || 0,
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      solid: "bg-orange-500",
    },
    {
      title: "Payments",
      value: kpis?.data?.totalPayments || 0,
      icon: CreditCard,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      solid: "bg-rose-500",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col mb-8 md:mb-10 space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
            Platform Metrics
          </h2>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase dark:text-white">
            Real-time Impact
          </h3>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="relative group overflow-hidden border-none bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[24px] md:rounded-[32px] p-5 md:p-6 h-full">
                {/* Background glow */}
                <div
                  className={cn(
                    "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity",
                    stat.bg
                  )}
                />

                <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                      stat.bg
                    )}
                  >
                    <stat.icon
                      className={cn("w-5 h-5 md:w-6 md:h-6", stat.color)}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-500 transition-colors truncate">
                      {stat.title}
                    </p>

                    {isLoading ? (
                      <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
                    ) : (
                      <p className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
                        {stat.value}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom progress bar */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500",
                    stat.solid
                  )}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPISReports;