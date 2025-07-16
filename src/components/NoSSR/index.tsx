"use client"

import { useEffect, useState, type ReactNode } from "react"

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Durante o SSR ou antes da hidratação, mostra o fallback
  if (!isMounted) {
    return <>{fallback}</>
  }

  // Após a hidratação, mostra o conteúdo real
  return <>{children}</>
}
