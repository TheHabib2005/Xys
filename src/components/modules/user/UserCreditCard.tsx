import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserCredit } from '@/services/credit.services'
import { useQuery } from '@tanstack/react-query'
import { Coins, Wallet } from 'lucide-react' // Modern icons
import { motion } from 'framer-motion' // For a smooth entrance

const UserCreditCard = () => {
  const { data, isLoading } = useQuery<{ data: { balance: number } }>({
    queryKey: ["fetch-user-credit"],
    queryFn: getUserCredit,
    refetchOnWindowFocus: false,
  })

  // Loading State: A pulse effect that matches the card shape
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 border rounded-xl bg-muted/20">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    )
  }

  const balance = data?.data?.balance || 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex items-center gap-4 p-3 pr-4 transition-all duration-300 border rounded-2xl bg-gradient-to-br from-background to-muted/30 hover:shadow-md hover:border-primary/20"
    >
      {/* Icon Section */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Wallet className="w-5 h-5" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col flex-1">
        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
          Available Credits
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold tracking-tight">
            {balance.toLocaleString()}
          </span>
          <Coins className="w-3 h-3 text-amber-500" />
        </div>
      </div>

      {/* Visual Badge */}
      <Badge 
        variant={balance > 0 ? "secondary" : "destructive"} 
        className="rounded-lg font-mono px-2 py-0.5"
      >
        {balance > 100 ? "VIP" : "Standard"}
      </Badge>
    </motion.div>
  )
}

export default UserCreditCard