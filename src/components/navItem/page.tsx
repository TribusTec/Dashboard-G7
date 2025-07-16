"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  isActive?: boolean
}

export function NavItem({ href, icon, label, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "`flex  w-full items-center gap-2    relative    transition-colors  flex    text-muted-foreground hover:text-marca ",
        isActive && ":font-bold flex  before:w-1  font-bold before:h-full before:bg-marca  before:absolute before:-right-6 before:top-0 text-marca",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
