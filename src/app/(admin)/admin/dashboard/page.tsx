'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getAdminDashboardData } from '@/services/admin.services'
import { 
  FileText, 
  BarChart3, 
  Wallet, 
  Users, 
  ArrowRight, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

const AdminDashboard = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: () => getAdminDashboardData(),
    staleTime: 1000 * 30,
  });

  const stats = response?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      
      {/* SaaS Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System Overview
          </h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-medium uppercase tracking-widest opacity-70">
              Live Analytics • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 gap-2 px-6">
          <Zap className="h-4 w-4 fill-current" />
          Generate Report
        </Button>
      </div>

      {/* Modern Metric Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Analysis Card */}
        <MetricCard 
          title="Analysis" 
          value={stats?.totalAnalysis || 0} 
          icon={<BarChart3 className="h-6 w-6" />}
          trend="+12.5%"
          color="blue"
        />

        {/* Resumes Card */}
        <MetricCard 
          title="Resumes" 
          value={stats?.totalResume || 0} 
          icon={<FileText className="h-6 w-6" />}
          trend="+4.2%"
          color="purple"
        />

        {/* Transactions Card (WITH LINK) */}
        <MetricCard 
          title="Transactions" 
          value={stats?.totalTransactions || 0} 
          icon={<Wallet className="h-6 w-6" />}
          trend="+18%"
          color="orange"
          link="/admin/dashboard/transactions"
        />

        {/* Users Card (WITH LINK) */}
        <MetricCard 
          title="Active Users" 
          value={stats?.users?.[0]?._count || 0} 
          icon={<Users className="h-6 w-6" />}
          trend="+22%"
          color="emerald"
          link="/admin/dashboard/users"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Large Visual Section */}
        <Card className="lg:col-span-2 border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl">System Activity</h3>
            </div>
            <div className="flex gap-2">
              {['Daily', 'Weekly', 'Monthly'].map(t => (
                <button key={t} className="text-xs font-bold px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tighter">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="h-[350px] flex items-center justify-center p-0">
             <div className="relative group cursor-crosshair">
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <p className="relative text-muted-foreground font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Activity metrics are climbing steady.
                </p>
             </div>
          </CardContent>
        </Card>

        {/* Status Breakdown Sidebar */}
        <Card className="border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <div className="p-8">
            <h3 className="font-bold text-xl mb-6">User Segments</h3>
            <div className="space-y-5">
              {stats?.users?.map((userGroup: any, idx: number) => (
                <div key={idx} className="group p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        {userGroup.status.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold capitalize">{userGroup.status.toLowerCase()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Verified Account</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black">{userGroup._count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// SaaS Level Metric Card Component
const MetricCard = ({ title, value, icon, trend, color, link }: { 
  title: string, 
  value: number | string, 
  icon: React.ReactNode, 
  trend: string,
  color: 'blue' | 'purple' | 'orange' | 'emerald',
  link?: string 
}) => {
  
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
  }

  const content = (
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {trend}
          </span>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h2 className="text-4xl font-black tracking-tight">{value}</h2>
        </div>
      </div>

      {link && (
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-primary hover:gap-2 transition-all">
          View Detailed Reports
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </CardContent>
  );

  return (
    <Card className={`relative overflow-hidden border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] transition-all duration-300 ${link ? 'hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] cursor-pointer' : ''}`}>
      {link ? (
        <Link href={link}>
          {content}
        </Link>
      ) : content}
    </Card>
  )
}

export default AdminDashboard