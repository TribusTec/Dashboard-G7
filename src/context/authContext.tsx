"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { saveAuthToken, removeAuthToken } from "@/utils/api"
import { toast } from "sonner"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { auth, database } from "@/services/firebase"
import { ref, get } from "firebase/database"

export type User = {
  id: string
  email: string
  name: string
  role: string
}

export type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  showLoadingTransition: boolean
  setShowLoadingTransition: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = ["/"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingTransition, setShowLoadingTransition] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Firebase Auth State Listener
  useEffect(() => {
    if (!mounted) return

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Usuário está logado no Firebase
          console.log("Firebase user detected:", firebaseUser.email)

          // Verificar se é admin
          const userRef = ref(database, `users/${firebaseUser.uid}`)
          const userSnapshot = await get(userRef)

          if (userSnapshot.exists() && userSnapshot.val().isAdmin) {
            const userData = userSnapshot.val()
            const idToken = await firebaseUser.getIdToken()

            // Salvar token
            await saveAuthToken(idToken)

            // Atualizar estado
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: userData.nome || firebaseUser.displayName || "",
              role: "admin",
            })
            setToken(idToken)

            // Se está na página de login, redirecionar para dashboard
            if (pathname === "/") {
              router.push("/Dashboard")
            }
          } else {
            // Não é admin, fazer logout
            console.warn("User is not an admin")
            await removeAuthToken()
            setUser(null)
            setToken(null)

            if (!PUBLIC_ROUTES.includes(pathname)) {
              router.push("/")
            }
          }
        } else {
          // Usuário não está logado
          console.log("No Firebase user detected")
          await removeAuthToken()
          setUser(null)
          setToken(null)

          // Só redirecionar se não estiver em rota pública
          if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        await removeAuthToken()
        setUser(null)
        setToken(null)

        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push("/")
        }
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [mounted, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setShowLoadingTransition(true)

    try {
      // Login with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Get user data from Realtime Database to check isAdmin flag
      const userRef = ref(database, `users/${firebaseUser.uid}`)
      const userSnapshot = await get(userRef)

      if (!userSnapshot.exists()) {
        throw new Error("User data not found in database")
      }

      const userData = userSnapshot.val()

      // Check if user is an admin
      if (!userData.isAdmin) {
        throw new Error("Unauthorized: Admin access required")
      }

      // Obtain token from Firebase
      const token = await firebaseUser.getIdToken()

      // Save token with expiration
      await saveAuthToken(token)

      // Update local state with user information
      const newUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        name: userData.nome || firebaseUser.displayName || "",
        role: "admin",
      }

      setUser(newUser)
      setToken(token)

      toast.success("Login bem-sucedido!", {
        description: "Redirecionando para o painel...",
        duration: 3000,
      })

      // Store email if remember me is checked (only on client)
      if (mounted && localStorage.getItem("rememberMe") === "true") {
        localStorage.setItem("savedEmail", email)
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/Dashboard")
      }, 1000)

      return firebaseUser
    } catch (error: any) {
      console.error("Login error:", error)

      // Provide more specific error messages
      if (error.message === "Unauthorized: Admin access required") {
        throw new Error("Acesso não autorizado: apenas administradores podem acessar este painel")
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        throw new Error("Email ou senha incorretos")
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Muitas tentativas. Tente novamente mais tarde")
      } else {
        throw error
      }
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setShowLoadingTransition(false)
      }, 500)
    }
  }

  const logout = async () => {
    setShowLoadingTransition(true)

    try {
      // Sign out from Firebase
      await auth.signOut()

      // Remove token from storage
      await removeAuthToken()

      // Clear user state
      setUser(null)
      setToken(null)

      // Clear localStorage (only on client)
      if (mounted) {
        localStorage.removeItem("rememberMe")
      }

      toast.success("Logout realizado com sucesso!")

      // Redirect to login
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setTimeout(() => {
        setShowLoadingTransition(false)
      }, 500)
    }
  }

  // Sempre retorna o contexto, mesmo durante o carregamento
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token && user.role === "admin",
    showLoadingTransition,
    setShowLoadingTransition,
    login,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
