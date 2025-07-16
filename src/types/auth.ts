export type User = {
    id?: string
    email: string
    isAdmin?: boolean
    name?: string
  }
  
  type AuthContextType = {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    showLoadingTransition: boolean
    setShowLoadingTransition: (show: boolean) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    refreshUserData: () => Promise<void>
  }
  