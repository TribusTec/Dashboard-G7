"use client"

import { useEffect } from "react"

import { useState } from "react"

// Utilitários para garantir builds consistentes
export const isBrowser = typeof window !== "undefined"
export const isServer = !isBrowser

// Função para verificar se estamos no cliente após hidratação
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

// Função para executar código apenas no cliente
export function clientOnly<T>(fn: () => T, fallback?: T): T | undefined {
  if (isBrowser) {
    return fn()
  }
  return fallback
}

// Hook para localStorage que funciona em SSR
export function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState<string>(() => {
    if (!isBrowser) {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? item : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: string | ((val: string) => string)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (isBrowser) {
        window.localStorage.setItem(key, valueToStore)
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
