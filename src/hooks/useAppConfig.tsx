"use client"

import { useState, useEffect } from "react"
import { database } from "@/services/firebase"
import { ref, set, get, onValue, off } from "firebase/database"

// Configurações do App
export interface AppConfig {
  PDF_GENERATOR_ENABLED: boolean
  USE_HEADER_HEIGHT: number
  USE_SIMPLIFIED_ONBOARDING: boolean
  USE_MULTIPLE_TRAILS_PDF: boolean
  USE_SINGLE_TRAILS_PDF: boolean
  NAME_APP: string
  POINTS_NAME: string
  EDIT_PROFILE: boolean
  SIMPLIFIED_ONBOARDING_CONFIG: {
    MIN_NAME_LENGTH: number
    AUTO_EMAIL_DOMAIN: string
    DEFAULT_VALUES: {
      telefone: string
      birthDate: string
      lgpdAccepted: boolean
      termsAccepted: boolean
    }
  }
}

// Configurações do Dashboard
export interface DashboardConfig {
  AUTO_REFRESH: boolean
  REFRESH_INTERVAL: number
  SHOW_NOTIFICATIONS: boolean
  COMPACT_MODE: boolean
  ITEMS_PER_PAGE: number
  DEFAULT_VIEW: "grid" | "list"
}

// Valores padrão
export const DEFAULT_APP_CONFIG: AppConfig = {
  PDF_GENERATOR_ENABLED: true,
  USE_HEADER_HEIGHT: 60,
  USE_SIMPLIFIED_ONBOARDING: false,
  USE_MULTIPLE_TRAILS_PDF: false,
  USE_SINGLE_TRAILS_PDF: true,
  NAME_APP: "Onodera",
  POINTS_NAME: "Onocash",
  EDIT_PROFILE: true,
  SIMPLIFIED_ONBOARDING_CONFIG: {
    MIN_NAME_LENGTH: 3,
    AUTO_EMAIL_DOMAIN: "educagame.temp",
    DEFAULT_VALUES: {
      telefone: "",
      birthDate: "",
      lgpdAccepted: true,
      termsAccepted: true,
    },
  },
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  AUTO_REFRESH: false,
  REFRESH_INTERVAL: 30,
  SHOW_NOTIFICATIONS: true,
  COMPACT_MODE: false,
  ITEMS_PER_PAGE: 20,
  DEFAULT_VIEW: "grid",
}

// Gerenciador de configurações com Firebase
export class ConfigManager {
  private static APP_CONFIG_PATH = "configuracoes/app"
  private static DASHBOARD_CONFIG_PATH = "configuracoes/dashboard"

  // App Config
  static async getAppConfig(): Promise<AppConfig> {
    try {
      const configRef = ref(database, this.APP_CONFIG_PATH)
      const snapshot = await get(configRef)

      if (snapshot.exists()) {
        return { ...DEFAULT_APP_CONFIG, ...snapshot.val() }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do app:", error)
    }
    return DEFAULT_APP_CONFIG
  }

  static async setAppConfig(config: AppConfig): Promise<void> {
    try {
      const configRef = ref(database, this.APP_CONFIG_PATH)
      await set(configRef, config)
    } catch (error) {
      console.error("Erro ao salvar configurações do app:", error)
      throw error
    }
  }

  static async resetAppConfig(): Promise<void> {
    try {
      await this.setAppConfig(DEFAULT_APP_CONFIG)
    } catch (error) {
      console.error("Erro ao resetar configurações do app:", error)
      throw error
    }
  }

  // Dashboard Config
  static async getDashboardConfig(): Promise<DashboardConfig> {
    try {
      const configRef = ref(database, this.DASHBOARD_CONFIG_PATH)
      const snapshot = await get(configRef)

      if (snapshot.exists()) {
        return { ...DEFAULT_DASHBOARD_CONFIG, ...snapshot.val() }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do dashboard:", error)
    }
    return DEFAULT_DASHBOARD_CONFIG
  }

  static async setDashboardConfig(config: DashboardConfig): Promise<void> {
    try {
      const configRef = ref(database, this.DASHBOARD_CONFIG_PATH)
      await set(configRef, config)
    } catch (error) {
      console.error("Erro ao salvar configurações do dashboard:", error)
      throw error
    }
  }

  static async resetDashboardConfig(): Promise<void> {
    try {
      await this.setDashboardConfig(DEFAULT_DASHBOARD_CONFIG)
    } catch (error) {
      console.error("Erro ao resetar configurações do dashboard:", error)
      throw error
    }
  }

  // Listeners em tempo real
  static onAppConfigChange(callback: (config: AppConfig) => void): () => void {
    const configRef = ref(database, this.APP_CONFIG_PATH)

    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...DEFAULT_APP_CONFIG, ...snapshot.val() })
      } else {
        callback(DEFAULT_APP_CONFIG)
      }
    })

    return () => off(configRef, "value", unsubscribe)
  }

  static onDashboardConfigChange(callback: (config: DashboardConfig) => void): () => void {
    const configRef = ref(database, this.DASHBOARD_CONFIG_PATH)

    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...DEFAULT_DASHBOARD_CONFIG, ...snapshot.val() })
      } else {
        callback(DEFAULT_DASHBOARD_CONFIG)
      }
    })

    return () => off(configRef, "value", unsubscribe)
  }
}

// Hooks para usar as configurações com Firebase
export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar configuração inicial
    ConfigManager.getAppConfig().then((initialConfig) => {
      setConfig(initialConfig)
      setLoading(false)
    })

    // Escutar mudanças em tempo real
    const unsubscribe = ConfigManager.onAppConfigChange((newConfig) => {
      setConfig(newConfig)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const updateConfig = async (newConfig: AppConfig) => {
    try {
      await ConfigManager.setAppConfig(newConfig)
      // O estado será atualizado automaticamente pelo listener
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error)
      throw error
    }
  }

  return { config, updateConfig, loading }
}

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar configuração inicial
    ConfigManager.getDashboardConfig().then((initialConfig) => {
      setConfig(initialConfig)
      setLoading(false)
    })

    // Escutar mudanças em tempo real
    const unsubscribe = ConfigManager.onDashboardConfigChange((newConfig) => {
      setConfig(newConfig)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const updateConfig = async (newConfig: DashboardConfig) => {
    try {
      await ConfigManager.setDashboardConfig(newConfig)
      // O estado será atualizado automaticamente pelo listener
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error)
      throw error
    }
  }

  return { config, updateConfig, loading }
}
