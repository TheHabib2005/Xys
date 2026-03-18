
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserCredit } from '@/services/credit.services'
import React, { useEffect, useState } from 'react'
import { useStackId } from 'recharts/types/cartesian/BarStack'

const UserCreditCard = () => {
   const [credit,setCredit] = useState(null);
   const getCredit = async ()=>{
    const res = await getUserCredit();
    if(res.success) setCredit(res.data.balance)
   }
   useEffect(()=>{
getCredit()
   },[credit])

   if(!credit) return <Skeleton className='w-10 h-10'/>
  return (
    <div className='flex items-center justify-between'>
      <span>User Credit</span> - 
      <Badge variant={"default"}>{credit || 0}</Badge>
    </div>
  )
}

export default UserCreditCard