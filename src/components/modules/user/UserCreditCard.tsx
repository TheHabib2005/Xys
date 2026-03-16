
import { Badge } from '@/components/ui/badge'
import { getUserCredit } from '@/services/credit.services'
import React from 'react'

const UserCreditCard = () => {
    // const credit = await getUserCredit()
  return (
    <Badge variant={"default"}>{0}</Badge>
  )
}

export default UserCreditCard