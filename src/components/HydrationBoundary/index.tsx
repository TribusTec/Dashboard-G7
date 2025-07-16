"use client"

import { useHydration } from "@/hooks/useHydration"
import type { ReactNode } from "react"

interface HydrationBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationBoundary({ children, fallback = null }: HydrationBoundaryProps) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}