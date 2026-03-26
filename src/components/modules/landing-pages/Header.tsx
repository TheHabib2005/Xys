'use client'

import { Button } from '@/components/ui/button'
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Tools', href: '/tools' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQs', href: '/faqs' },
  ]

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with enhanced styling */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Builder.io
            </span>
          </Link>

          {/* Desktop Navigation with underline hover effect */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle with animation */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:shadow-md"
              aria-label="Toggle theme"
            >
              <div className="relative z-10">
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-blue-500/20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-gray-900 dark:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/80 rounded-full px-5 transition-all duration-300"
              >
                Log In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300">
                Get Started
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with smooth animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-200/50 dark:border-gray-800/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
              <Button
                variant="ghost"
                className="w-full text-gray-900 dark:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/80 rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md">
                Get Started
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}