"use client"

import type React from "react"
import { AuthProvider } from "@/context/authContext"
import { ThemeProvider } from "@/components/Theme"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
