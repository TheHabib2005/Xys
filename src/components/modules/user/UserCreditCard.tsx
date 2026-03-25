import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserCredit } from '@/services/credit.services'
import { useQuery } from '@tanstack/react-query'
import { Coins, Wallet, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const UserCreditCard = () => {
  const { data, isLoading } = useQuery<{ data: { balance: number } }>({
    queryKey: ['fetch-user-credit'],
    queryFn: getUserCredit,
    refetchOnWindowFocus: true,
  })

  // Loading state: subtle skeleton with shimmer
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    )
  }

  const balance = data?.data?.balance ?? 0

  // Determine status based on balance
  const getStatus = () => {
    if (balance <= 0) return { label: 'Empty', variant: 'destructive', icon: null }
    if (balance < 50) return { label: 'Low', variant: 'warning', icon: null }
    if (balance < 200) return { label: 'Standard', variant: 'secondary', icon: null }
    return { label: 'Premium', variant: 'default', icon: <Sparkles className="w-3 h-3 mr-1" /> }
  }

  const status = getStatus()

  // For a visual progress bar (optional, if we had a limit)
  // We'll simulate a "limit" of 500 credits for demonstration
  const creditLimit = 500
  const progressPercent = Math.min((balance / creditLimit) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50/80 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 p-4 shadow-lg shadow-gray-200/50 dark:shadow-black/20 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Animated gradient border (on hover) */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4">
        {/* Left: Icon & Balance */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner group-hover:from-primary/30 group-hover:to-primary/10 transition-colors"
          >
            <Wallet className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
          </motion.div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Available Credits
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {balance.toLocaleString()}
              </span>
              <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Right: Status Badge & optional progress */}
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={status.variant as any}
            className="rounded-full px-3 py-1 text-xs font-medium shadow-sm flex items-center gap-1 backdrop-blur-sm"
          >
            {status.icon}
            {status.label}
          </Badge>

          {/* Optional progress bar (shows usage up to a soft limit) */}
          {balance < creditLimit && (
            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              />
            </div>
          )}
        </div>
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </motion.div>
  )
}

export default UserCreditCard