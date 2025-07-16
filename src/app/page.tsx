"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { useAuth } from "@/context/authContext"
import { Eye, EyeOff, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Logo from "@/assets/logo.svg"
import LogoD from "@/assets/logoD.svg"
import Fundo from "@/assets/login.jpg"
import { PageTitle } from "@/components/Head"
import { useLocalStorage } from "@/lib/build-utils"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(2, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

function LoginForm() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  const [savedEmail, setSavedEmail] = useLocalStorage("savedEmail", "")
  const [savedRememberMe, setSavedRememberMe] = useLocalStorage("rememberMe", "false")

  // Sempre executar os hooks na mesma ordem
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("Dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setMounted(true)

    if (savedRememberMe === "true") {
      setRememberMe(true)
      if (savedEmail) {
        setEmail(savedEmail)
      }
    }
  }, [savedEmail, savedRememberMe])

  useEffect(() => {
    // Só executar após montar no cliente
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

  const handleLogin = async () => {
    setIsSubmitting(true)
    setErrors({})

    try {
      loginSchema.parse({ email, password })

      // Só acessar localStorage após montar
      if (mounted) {
        if (rememberMe) {
          setSavedRememberMe("true")
          setSavedEmail(email)
        } else {
          setSavedRememberMe("false")
          setSavedEmail("")
        }
      }

      await login(email, password)
    } catch (error: any) {
      setIsSubmitting(false)

      if (error instanceof z.ZodError) {
        const formattedErrors: { email?: string; password?: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0] === "email") {
            formattedErrors.email = err.message
          }
          if (err.path[0] === "password") {
            formattedErrors.password = err.message
          }
        })
        setErrors(formattedErrors)

        toast.error("Erro de validação!", {
          description: "Por favor, corrija os erros no formulário.",
          duration: 4000,
        })
      } else {
        toast.error("Erro ao fazer login", {
          description: error.message || "Email ou senha incorretos. Tente novamente.",
          duration: 4000,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-right" richColors closeButton />

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-transparent dark:bg-background/50 border-none shadow-none">
          <div className="flex mb-6 mr-12">
            <div className="relative h-[60px] w-[180px]">

  <Image
    src={Logo}
    alt="Logo claro"
    fill
    className="object-contain dark:hidden"
    priority
  />

 
  <Image
    src={LogoD}
    alt="Logo escuro"
    fill
    className="object-contain hidden dark:block"
    priority
  />
</div>
          </div>
          <CardHeader className="px-0">
            <CardTitle className="text-4xl text-marca font-bold">Olá novamente</CardTitle>
            <CardDescription className="text-muted-foreground text-md">
              Faça login para começar a usar seu Dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-0">
            {!isOnline && (
              <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <WifiOff className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">Sem conexão</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  Você está offline. Conecte-se à internet para continuar.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`py-6 focus-visible:ring-marca/20 focus:border-marca ${
                  errors.email ? "border-destructive focus-visible:ring-destructive focus:border-transparent " : ""
                }`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Digite sua senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`py-6 focus-visible:ring-marca/20 focus:border-marca ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive  focus:border-transparent "
                      : ""
                  }`}
                  aria-invalid={!!errors.password}
                />
                <button
                  className=" absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm font-medium text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-0">
            <Button className="w-full bg-marca hover:bg-marca/90 py-6 text-white" onClick={handleLogin} disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden md:block md:w-1/2 relative">
        <Image src={Fundo || "/placeholder.svg"} alt="Login background" fill className="object-cover" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <PageTitle title="Login" />
      <LoginForm />
    </>
  )
}
