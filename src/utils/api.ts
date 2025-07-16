// Utility functions for API requests and token management

import { getAuth } from "firebase/auth"

export const saveAuthToken = async (token: string, expiresIn = 86400): Promise<void> => {
  try {
    const expiresAt = Date.now() + expiresIn * 1000
    localStorage.setItem("auth_token", JSON.stringify({ token, expiresAt }))
  } catch (error) {
    console.error("Erro ao salvar token de autenticação:", error)
  }
}

export const removeAuthToken = async (): Promise<void> => {
  try {
    localStorage.removeItem("auth_token")
  } catch (error) {
    console.error("Erro ao remover token de autenticação:", error)
  }
}

export const getToken = () => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      try {
        const parsed = JSON.parse(storedToken)
        const { token, expiresAt } = parsed
        if (Date.now() > expiresAt) {
          console.warn("Token expirado, removendo...")
          localStorage.removeItem("auth_token")
          return null
        }
        return parsed
      } catch (error) {
        console.error("Erro ao fazer parse do token:", error)
        localStorage.removeItem("auth_token")
        return null
      }
    }
  }
  return null
}

const API_BASE_URL = "https://api-zo3lscaxfq-uc.a.run.app/api"


export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const tokenData = getToken()

  // Define headers with content type
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Only add authorization header if token exists
  if (tokenData && tokenData.token) {
    headers["Authorization"] = `Bearer ${tokenData.token}`
  } else {
    console.warn("Token não encontrado ou expirado - fazendo requisição sem autenticação")
  }

  console.log(`Fazendo requisição para: ${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : undefined,
  })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Special handling for authentication errors
      if (response.status === 401) {
        console.error("Erro de autenticação: Token inválido ou expirado")
        // Clear the invalid token
        localStorage.removeItem("auth_token")
        throw new Error("🔒 Sessão expirada. Por favor, faça login novamente.")
      }

      let errorData
      try {
        errorData = await response.json()
        console.error("Detalhes do erro:", errorData)

        // Log mais detalhes para debug
        if (errorData.error) {
          console.error("Erro específico:", errorData.error)
        }

        if (errorData.validationErrors) {
          console.error("Erros de validação:", errorData.validationErrors)
        }
      } catch (e) {
        console.error("Não foi possível obter detalhes do erro")
      }

      // Cria uma mensagem de erro mais detalhada
      const errorMessage = errorData?.message || `Erro na requisição: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)

      // Adiciona detalhes extras ao objeto de erro
      if (errorData) {
        // @ts-ignore
        error.details = errorData
      }

      throw error
    }

    const data = await response.json()
    console.log(`Dados recebidos (${endpoint}):`, data)
    return data
  } catch (error: any) {
    console.error(`Erro na requisição para ${endpoint}:`, error)
    throw error
  }
}

// Adicione esta função para gerar IDs únicos
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Remove the mock login functionality and update the login function
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // This function is no longer used directly as we're handling login in authContext
      // But we'll keep it for API structure consistency
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error("Authentication failed")
        }

        const data = await response.json()

        if (data.token) {
          await saveAuthToken(data.token)
        }

        return data
      } catch (error) {
        console.error("Login API error:", error)
        throw error
      }
    },
    verify: () => fetchAPI("/auth/verify"),
  },

  trails: {
    create: async (novaTrilha: any, token: string) => {
      try {
        // Get the current Firebase user and fresh token
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
          throw new Error("Usuário não autenticado")
        }

        // Get a fresh token directly from Firebase
        const idToken = await user.getIdToken(true) // Force refresh the token

        // Ensure the trail has an ID
        if (!novaTrilha.id) {
          novaTrilha.id = `trilha_${Date.now()}`
        }

        const trilhaCompleta = {
          id: novaTrilha.id,
          nome: novaTrilha.nome || "Nova Trilha",
          descricao: novaTrilha.descricao || "",
          etapas: novaTrilha.etapas || [],
          backgroundSvg: novaTrilha.backgroundSvg || "",
        }

        console.log("Enviando trilha para API:", trilhaCompleta)

        // Use Firebase REST API approach for consistency
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${novaTrilha.id}.json?auth=${idToken}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(trilhaCompleta),
          },
        )

        if (!response.ok) {
          throw new Error("Erro ao criar trilha: " + response.statusText)
        }

        const data = await response.json()
        console.log("Trilha criada com sucesso:", data)
        return data
      } catch (error) {
        console.error("Erro ao criar trilha:", error)
        throw error
      }
    },
    getAll: async () => {
      const response = await fetchAPI("/trails")

      if (response && response.status === 200 && Array.isArray(response.data)) {
        return response
      } else if (Array.isArray(response)) {
        return {
          status: 200,
          message: "Trilhas encontradas com sucesso",
          count: response.length,
          data: response,
        }
      }

      return response
    },
    getById: (id: string) => fetchAPI(`/trails/${id}`),
    delete: async (id: string, token: string) => {
      try {
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
          throw new Error("Usuário não autenticado")
        }

        const idToken = await user.getIdToken()

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${id}.json?auth=${idToken}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          throw new Error("Erro ao deletar trilha: " + response.statusText)
        }

        console.log("Trilha deletada com sucesso!")
        return true
      } catch (error) {
        console.error("Erro ao excluir trilha do Firebase:", error)
        throw error
      }
    },
    update: async (id: string, updatedData: any, token: string) => {
      try {
        // Get the current Firebase user and fresh token
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
          throw new Error("Usuário não autenticado")
        }

        // Get a fresh token directly from Firebase
        const idToken = await user.getIdToken(true) // Force refresh the token

        // Log dos dados que estão sendo enviados para debug
        console.log("Atualizando trilha com ID:", id)
        console.log("Dados enviados:", JSON.stringify(updatedData, null, 2))

        // Use Firebase REST API approach for consistency with create function
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${id}.json?auth=${idToken}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          },
        )

        if (!response.ok) {
          throw new Error("Erro ao atualizar trilha: " + response.statusText)
        }

        const data = await response.json()
        console.log("Trilha atualizada com sucesso:", data)
        return data
      } catch (error) {
        console.error("Erro ao atualizar trilha:", error)
        throw new Error(`Erro ao atualizar trilha: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  },
}
