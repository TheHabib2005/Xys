import { Button } from '@/components/ui/button';
import { Badge, Edit } from 'lucide-react';
import React from 'react'

const PlanCard = ({plan}) => {
  return (
    <div
                key={plan.id}
                className="grid grid-cols-12 px-6 py-4 border-b items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
              >
                {/* <div className="col-span-3 font-medium">{plan.name}</div>
                <div className="hidden md:block col-span-2">{plan.credits}</div>
                <div className="hidden md:block col-span-2">{plan.currency} {plan.price}</div>
                <div className="col-span-2">
                  <Badge className={`rounded-full px-2 py-1 ${plan.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="col-span-2 hidden md:block">{new Date(plan.createdAt).toLocaleDateString()}</div>
                <div className="col-span-1 text-right">
                  <Button size="sm" variant="outline" onClick={() => { setEditingPlan(plan); setStatus(plan.isActive ? 'Active' : 'Inactive') }}>
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </div> */}
              </div>
  )
}

export default PlanCard