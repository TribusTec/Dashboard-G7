"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"

// Custom schema for admin validation
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(2, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

export function useLogin() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check online status - sempre executado
  useEffect(() => {
    if (!mounted) return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [mounted])

  // Redirect if already authenticated - sempre executado
  useEffect(() => {
    if (!mounted) return

    if (isAuthenticated) {
      router.push("/Dashboard")
    }
  }, [isAuthenticated, router, mounted])

  // Load saved email if remember me was checked - sempre executado
  useEffect(() => {
    if (!mounted) return

    const savedRememberMe = localStorage.getItem("rememberMe") === "true"
    setRememberMe(savedRememberMe)

    if (savedRememberMe) {
      const savedEmail = localStorage.getItem("savedEmail")
      if (savedEmail) setEmail(savedEmail)
    }
  }, [mounted])

  const handleLogin = async () => {
    setIsSubmitting(true)
    setErrors({})
    setApiError(null)

    try {
      loginSchema.parse({ email, password })

      if (mounted) {
        localStorage.setItem("rememberMe", rememberMe.toString())
        if (rememberMe) {
          localStorage.setItem("savedEmail", email)
        } else {
          localStorage.removeItem("savedEmail")
        }
      }

      // Verificar se é um login admin
      if (email.endsWith("@admin.educagame.com") && password === "admin") {
        // Login admin especial
        await login(email, password)
      } else {
        // Login normal
        await login(email, password)
      }
    } catch (error: any) {
      setIsSubmitting(false)

      if (error instanceof z.ZodError) {
        const formattedErrors: { email?: string; password?: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0] === "email") formattedErrors.email = err.message
          if (err.path[0] === "password") formattedErrors.password = err.message
        })
        setErrors(formattedErrors)

        toast.error("Erro de validação!", {
          description: "Por favor, corrija os erros no formulário.",
          duration: 4000,
        })
      } else {
        let errorMessage = "Ocorreu um erro inesperado. Tente novamente."

        if (error.message === "Email ou senha incorretos") {
          errorMessage = "Email ou senha incorretos."
        } else if (error.message.includes("network") || error.message === "Failed to fetch") {
          errorMessage = "Erro de conexão. Verifique sua internet."
        } else if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          errorMessage = "Email ou senha incorretos."
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Muitas tentativas. Tente novamente mais tarde."
        } else {
          errorMessage = error.message || errorMessage
        }

        setApiError(errorMessage)

        toast.error("Erro ao fazer login", {
          description: errorMessage,
          duration: 4000,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    apiError,
    isOnline,
    isSubmitting,
    handleLogin,
    mounted,
  }
}
