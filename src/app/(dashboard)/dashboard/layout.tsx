import DashboardHeader from '@/components/modules/user/DashboardHeader'
import DashboardSidebar from '@/components/modules/user/DashboardSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

import { getUserCredit } from '@/services/credit.services'
import React, { ReactNode } from 'react'
const layout = async({children}:{children:ReactNode}) => {

  
      const credit = await getUserCredit();
    
  return (
    <div className='min-h-screen  w-full bg-background'>
          <DashboardHeader />

  
        
       <div className='flex items-start w-full'>

         <DashboardSidebar/>
         <div className='w-full'>
        
            {children}
      
         </div>

       </div>
    
  
    </div>
  )
}

export default layout