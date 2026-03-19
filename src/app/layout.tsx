import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

import UserContextWrapper from '../context/UserContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


export const metadata: Metadata = {
  metadataBase: new URL("https://blitz-analyzer.com"),

  applicationName: "Blitz Analyzer",
  title: {
    default: "AI Resume Builder - Create ATS Friendly Resume",
    template: "%s | AI Resume Builder"
  },

  description:
    "Build professional, ATS-friendly resumes in minutes using our AI Resume Builder. Choose modern templates, customize easily, and download instantly.",

  keywords: [
    "resume builder",
    "ats friendly resume",
    "ai resume builder",
    "job resume builder"
  ],

  authors: [{ name: "Habibur Rhaman" }],
  creator: "Habibur Rhaman",
  publisher: "Habibur Rhaman",

 
 
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },

  category: "technology"
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

      
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans mx-auto antialiased bg-background text-foreground`}>
      
        <Providers>
          <UserContextWrapper>
       {children}
        </UserContextWrapper>
        </Providers>
      </body>
    </html>
  )
}
