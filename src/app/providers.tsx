'use client'

import { SidebarProvider } from '../components/ui/sidebar'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'
import { Toaster } from 'sonner'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined


export function Providers({ children }: { children: React.ReactNode }) {
 const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } }))


  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}





