"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/Head"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Monitor, Smartphone } from "lucide-react"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [selectedConfig, setSelectedConfig] = useState<string>("")

  const configOptions = [
    {
      value: "app",
      label: "Configurações do App",
      description: "Configurações gerais do aplicativo",
      icon: <Smartphone className="w-5 h-5" />,
      href: "/Configuracoes/app",
    },
    {
      value: "dashboard",
      label: "Configurações do Dashboard",
      description: "Configurações da interface administrativa",
      icon: <Monitor className="w-5 h-5" />,
      href: "/Configuracoes/dashboard",
    },
  ]

  useEffect(() => {

    router.replace("/Configuracoes/app")
  }, [router])

  const handleConfigChange = (value: string) => {
    setSelectedConfig(value)
    const option = configOptions.find((opt) => opt.value === value)
    if (option) {
      router.push(option.href)
    }
  }

  return (
    <>
      <PageTitle title="Configurações" />
      <Sidebar />
      <main className="sm:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Configurações</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações do sistema</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Selecionar Configuração
              </CardTitle>
              <CardDescription>Escolha qual tipo de configuração você deseja gerenciar</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedConfig} onValueChange={handleConfigChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma configuração..." />
                </SelectTrigger>
                <SelectContent>
                  {configOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {configOptions.map((option) => (
              <Card
                key={option.value}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleConfigChange(option.value)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Clique para acessar as configurações</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
