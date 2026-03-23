import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import html2pdf from "html2pdf.js"
import Handlebars from 'handlebars'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


