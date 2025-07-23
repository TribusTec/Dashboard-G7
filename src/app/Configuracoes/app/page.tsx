"use client"
import { useState, useEffect } from "react"
import { useAppConfig, type AppConfig, ConfigManager } from "@/hooks/useAppConfig"
import { PageTitle } from "@/components/Head"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Save, Smartphone, RotateCcw, Loader2 } from "lucide-react"

export default function ConfiguracoesAppPage() {
  const { config: initialConfig, loading } = useAppConfig()
  const [appConfig, setAppConfig] = useState<AppConfig>(initialConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  // Atualizar estado local quando a configuração inicial carregar
  useEffect(() => {
    if (!loading) {
      setAppConfig(initialConfig)
      setHasChanges(false)
    }
  }, [initialConfig, loading])

  const updateAppConfig = (key: keyof AppConfig, value: any) => {
    setAppConfig((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const updateSimplifiedConfig = (key: string, value: any) => {
    setAppConfig((prev) => ({
      ...prev,
      SIMPLIFIED_ONBOARDING_CONFIG: {
        ...prev.SIMPLIFIED_ONBOARDING_CONFIG,
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await ConfigManager.setAppConfig(appConfig)
      toast.success("Configurações do app salvas com sucesso!")
      setHasChanges(false)
    } catch (error) {
      toast.error("Erro ao salvar configurações. Tente novamente.")
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    try {
      await ConfigManager.resetAppConfig()
      toast.info("Configurações do app resetadas para os valores padrão")
      setHasChanges(false)
    } catch (error) {
      toast.error("Erro ao resetar configurações. Tente novamente.")
      console.error("Erro ao resetar:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <PageTitle title="Configurações do App" />
        <Sidebar />
        <div className="p-4 sm:ml-64">
          <div className="p-4  rounded-lg ">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle title="Configurações do App" />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4   rounded-lg ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                Configurações do App
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as configurações gerais do aplicativo</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={saving}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Configurações Gerais do App */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações básicas do aplicativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Nome do App</Label>
                    <Input
                      id="app-name"
                      value={appConfig.NAME_APP}
                      onChange={(e) => updateAppConfig("NAME_APP", e.target.value)}
                      placeholder="Nome do aplicativo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-name">Nome dos Pontos</Label>
                    <Input
                      id="points-name"
                      value={appConfig.POINTS_NAME}
                      onChange={(e) => updateAppConfig("POINTS_NAME", e.target.value)}
                      placeholder="Nome da moeda/pontos"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-height">Altura do Header (px)</Label>
                  <Input
                    id="header-height"
                    type="number"
                    value={appConfig.USE_HEADER_HEIGHT}
                    onChange={(e) => updateAppConfig("USE_HEADER_HEIGHT", Number.parseInt(e.target.value) || 60)}
                    placeholder="60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>Ative ou desative funcionalidades do aplicativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gerador de PDF</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permite a geração de relatórios em PDF</p>
                  </div>
                  <Switch
                    checked={appConfig.PDF_GENERATOR_ENABLED}
                    onCheckedChange={(checked) => updateAppConfig("PDF_GENERATOR_ENABLED", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Edição de Perfil</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permite que usuários editem seus perfis</p>
                  </div>
                  <Switch
                    checked={appConfig.EDIT_PROFILE}
                    onCheckedChange={(checked) => updateAppConfig("EDIT_PROFILE", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cadastro Simplificado</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usa fluxo simplificado de cadastro (apenas nome e avatar)
                    </p>
                  </div>
                  <Switch
                    checked={appConfig.USE_SIMPLIFIED_ONBOARDING}
                    onCheckedChange={(checked) => updateAppConfig("USE_SIMPLIFIED_ONBOARDING", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de PDF */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações de PDF</CardTitle>
                <CardDescription>Configure como os PDFs são gerados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PDF de Múltiplas Trilhas</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permite gerar PDF com múltiplas trilhas</p>
                  </div>
                  <Switch
                    checked={appConfig.USE_MULTIPLE_TRAILS_PDF}
                    onCheckedChange={(checked) => updateAppConfig("USE_MULTIPLE_TRAILS_PDF", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PDF de Trilha Única</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permite gerar PDF de uma trilha específica
                    </p>
                  </div>
                  <Switch
                    checked={appConfig.USE_SINGLE_TRAILS_PDF}
                    onCheckedChange={(checked) => updateAppConfig("USE_SINGLE_TRAILS_PDF", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Cadastro Simplificado */}
            {appConfig.USE_SIMPLIFIED_ONBOARDING && (
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro Simplificado</CardTitle>
                  <CardDescription>Configurações específicas para o fluxo de cadastro simplificado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-name">Tamanho Mínimo do Nome</Label>
                      <Input
                        id="min-name"
                        type="number"
                        value={appConfig.SIMPLIFIED_ONBOARDING_CONFIG.MIN_NAME_LENGTH}
                        onChange={(e) =>
                          updateSimplifiedConfig("MIN_NAME_LENGTH", Number.parseInt(e.target.value) || 3)
                        }
                        placeholder="3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-domain">Domínio de Email Automático</Label>
                      <Input
                        id="email-domain"
                        value={appConfig.SIMPLIFIED_ONBOARDING_CONFIG.AUTO_EMAIL_DOMAIN}
                        onChange={(e) => updateSimplifiedConfig("AUTO_EMAIL_DOMAIN", e.target.value)}
                        placeholder="educagame.temp"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Valores Padrão</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="default-phone">Telefone Padrão</Label>
                        <Input
                          id="default-phone"
                          value={appConfig.SIMPLIFIED_ONBOARDING_CONFIG.DEFAULT_VALUES.telefone}
                          onChange={(e) =>
                            updateSimplifiedConfig("DEFAULT_VALUES", {
                              ...appConfig.SIMPLIFIED_ONBOARDING_CONFIG.DEFAULT_VALUES,
                              telefone: e.target.value,
                            })
                          }
                          placeholder="Deixe vazio para não preencher"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="default-birth">Data de Nascimento Padrão</Label>
                        <Input
                          id="default-birth"
                          value={appConfig.SIMPLIFIED_ONBOARDING_CONFIG.DEFAULT_VALUES.birthDate}
                          onChange={(e) =>
                            updateSimplifiedConfig("DEFAULT_VALUES", {
                              ...appConfig.SIMPLIFIED_ONBOARDING_CONFIG.DEFAULT_VALUES,
                              birthDate: e.target.value,
                            })
                          }
                          placeholder="Deixe vazio para não preencher"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
