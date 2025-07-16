"use client"

import { useEffect, useState } from "react"

type LoadingTransitionProps = {
  isLoading: boolean
  onFinish?: () => void
}

export function LoadingTransition({ isLoading, onFinish }: LoadingTransitionProps) {
  const [show, setShow] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
    } else {
      const timer = setTimeout(() => {
        setShow(false)
        onFinish?.()
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isLoading, onFinish])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500">
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-[#61DAFB] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
