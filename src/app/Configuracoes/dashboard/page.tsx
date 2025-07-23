"use client"
import { useState, useEffect } from "react"
import { useDashboardConfig, type DashboardConfig, ConfigManager } from "@/hooks/useAppConfig"
import { PageTitle } from "@/components/Head"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Save, Monitor, RotateCcw, Loader2, Eye } from "lucide-react"

export default function ConfiguracoesDashboardPage() {
  const { config: initialConfig, loading } = useDashboardConfig()
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(initialConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  // Atualizar estado local quando a configuração inicial carregar
  useEffect(() => {
    if (!loading) {
      setDashboardConfig(initialConfig)
      setHasChanges(false)
    }
  }, [initialConfig, loading])

  const updateDashboardConfig = (key: keyof DashboardConfig, value: any) => {
    setDashboardConfig((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await ConfigManager.setDashboardConfig(dashboardConfig)
      toast.success("Configurações do dashboard salvas com sucesso!")
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
      await ConfigManager.resetDashboardConfig()
      toast.info("Configurações do dashboard resetadas para os valores padrão")
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
        <PageTitle title="Configurações do Dashboard" />
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
      <PageTitle title="Configurações do Dashboard" />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Monitor className="w-6 h-6" />
                Configurações do Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Personalize a experiência do painel administrativo
              </p>
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
            {/* Configurações de Atualização */}
            <Card>
              <CardHeader>
                <CardTitle>Atualização de Dados</CardTitle>
                <CardDescription>Configure como os dados são atualizados no dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualização Automática</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Atualiza os dados automaticamente em intervalos regulares
                    </p>
                  </div>
                  <Switch
                    checked={dashboardConfig.AUTO_REFRESH}
                    onCheckedChange={(checked) => updateDashboardConfig("AUTO_REFRESH", checked)}
                  />
                </div>

                {dashboardConfig.AUTO_REFRESH && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Intervalo de Atualização (segundos)</Label>
                      <Input
                        id="refresh-interval"
                        type="number"
                        min="10"
                        max="300"
                        value={dashboardConfig.REFRESH_INTERVAL}
                        onChange={(e) =>
                          updateDashboardConfig("REFRESH_INTERVAL", Number.parseInt(e.target.value) || 30)
                        }
                        placeholder="30"
                      />
                      <p className="text-xs text-gray-500">Mínimo: 10 segundos, Máximo: 300 segundos</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Configurações de Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Interface</CardTitle>
                <CardDescription>Personalize a aparência e comportamento da interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar Notificações</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exibe notificações de sistema e alertas</p>
                  </div>
                  <Switch
                    checked={dashboardConfig.SHOW_NOTIFICATIONS}
                    onCheckedChange={(checked) => updateDashboardConfig("SHOW_NOTIFICATIONS", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Compacto</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reduz o espaçamento e tamanho dos elementos
                    </p>
                  </div>
                  <Switch
                    checked={dashboardConfig.COMPACT_MODE}
                    onCheckedChange={(checked) => updateDashboardConfig("COMPACT_MODE", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Visualização */}
            <Card>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
                <CardDescription>Configure como os dados são exibidos nas listas e tabelas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="items-per-page">Itens por Página</Label>
                    <Select
                      value={dashboardConfig.ITEMS_PER_PAGE.toString()}
                      onValueChange={(value) => updateDashboardConfig("ITEMS_PER_PAGE", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 itens</SelectItem>
                        <SelectItem value="20">20 itens</SelectItem>
                        <SelectItem value="50">50 itens</SelectItem>
                        <SelectItem value="100">100 itens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-view">Visualização Padrão</Label>
                    <Select
                      value={dashboardConfig.DEFAULT_VIEW}
                      onValueChange={(value: "grid" | "list") => updateDashboardConfig("DEFAULT_VIEW", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grade</SelectItem>
                        <SelectItem value="list">Lista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview das Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview das Configurações
                </CardTitle>
                <CardDescription>Veja como suas configurações afetarão o dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium">Atualização Automática:</span>
                    <Badge variant={dashboardConfig.AUTO_REFRESH ? "default" : "secondary"}>
                      {dashboardConfig.AUTO_REFRESH ? "Ativada" : "Desativada"}
                    </Badge>
                  </div>

                  {dashboardConfig.AUTO_REFRESH && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <span className="text-sm font-medium">Intervalo:</span>
                      <Badge variant="outline">{dashboardConfig.REFRESH_INTERVAL}s</Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium">Notificações:</span>
                    <Badge variant={dashboardConfig.SHOW_NOTIFICATIONS ? "default" : "secondary"}>
                      {dashboardConfig.SHOW_NOTIFICATIONS ? "Visíveis" : "Ocultas"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium">Modo de Visualização:</span>
                    <Badge variant="outline">{dashboardConfig.COMPACT_MODE ? "Compacto" : "Normal"}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium">Itens por Página:</span>
                    <Badge variant="outline">{dashboardConfig.ITEMS_PER_PAGE}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium">Visualização Padrão:</span>
                    <Badge variant="outline">{dashboardConfig.DEFAULT_VIEW === "grid" ? "Grade" : "Lista"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
