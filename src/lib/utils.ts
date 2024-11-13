import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStrinGify =(value:unknown)=>{
  return JSON.parse(JSON.stringify(value))
}