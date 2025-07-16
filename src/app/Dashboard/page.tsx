"use client"
import { Users, BookOpen, ListChecks, HelpCircle, FileText } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import DashUsuarios from "@/components/DashUsuarios"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { useUsers } from "@/hooks/useUsers"
import { useTrails } from "@/hooks/useTrilhas"
import { PageTitle } from "@/components/Head"
import UserPerformanceChart from "@/components/chart/usuarioPerformaceChart"
import TrilhaStructureChart from "@/components/chart/trilhaEstrutura"
import TrilhaQuestionsChart from "@/components/chart/trilhaQuestoesChart"
import UserProgressChart from "@/components/chart/usuarioProgressoChart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { generateDashboardPDF } from "@/utils/pdf"
import { ProtectedRoute } from "@/components/rotaSegura"

function DashboardContent() {
  const { users, loading } = useUsers(null)
  const { trilhas, isLoading: trilhasLoading, error } = useTrails()
  const totalTrilhas = trilhas.length
  const totalEtapas = trilhas.reduce((total, trilha) => total + (trilha.etapas?.length ?? 0), 0)

  const handleGeneratePDF = () => {
    generateDashboardPDF(users.length, totalTrilhas, totalEtapas, trilhas)
  }

  return (
    <>
      <PageTitle title="Dashboard" />
      <Sidebar />
      <main className="sm:ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 bg-marca hover:bg-marca/80 text-white"
          >
            <FileText className="h-4 w-4" />
            Gerar Relatório PDF
          </Button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Total de usuários na plataforma</p>
              </div>
              <Users className="h-4 w-4 text-marca" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mt-1">{loading ? "Carregando..." : users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium">Total de Trilhas</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Trilhas de aprendizado disponíveis</p>
              </div>
              <BookOpen className="h-4 w-4 text-marca" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mt-1">{totalTrilhas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium">Total de Etapas</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Etapas de aprendizado cadastradas</p>
              </div>
              <ListChecks className="h-4 w-4 text-marca" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mt-1">{totalEtapas}</div>
            </CardContent>
          </Card>
        </section>

        {/* Seção de gráficos com explicações */}
        <div className="mt-8 mb-2 flex items-center">
          <h2 className="text-xl font-bold">Análise de Dados</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  Estes gráficos mostram análises importantes sobre o desempenho dos usuários e a estrutura das trilhas
                  de aprendizado.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Primeira linha de gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UserPerformanceChart />
          <TrilhaQuestionsChart />
        </section>

        {/* Segunda linha de gráficos */}
        <section className="mt-4">
          <TrilhaStructureChart />
        </section>

        {/* Terceira linha de gráficos */}
        <section className="mt-4">
          <UserProgressChart />
        </section>

        <div className="mt-8">
          <DashUsuarios />
        </div>
      </main>
    </>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
