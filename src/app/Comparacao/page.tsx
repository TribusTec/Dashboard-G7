"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Trophy,
  Users2,
  Search,
  Clock,
  BookOpen,
  FileText,
} from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { Sidebar } from "@/components/sidebar"
import { PageTitle } from "@/components/Head"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import Link from "next/link"
import { useTrails } from "@/hooks/useTrilhas"

// Função para formatar tempo em formato legível
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}min ${remainingSeconds}s` : `${minutes}min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}min`
  }

  return `${hours}h`
}

// Função específica para tempo médio por questão (sempre em minutos)
const formatQuestionTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (remainingSeconds > 0) {
    return `${minutes}min ${remainingSeconds}s`
  }

  return `${minutes}min`
}

const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

// Mock data for trails - in real app, this would come from Firebase
const trilhasData = {
  trilha_1747571368614: { nome: "Institucional", etapas: ["História", "Cliente", "Marca"] },
  trilha_1747619409609: { nome: "Comercial", etapas: ["Avaliação", "Cliente", "Cuidados", "Cliente Voucher"] },
  trilha_1747790103107: { nome: "Científico", etapas: ["Excelência", "Tratamentos", "Disfunções x Tratamentos"] },
}

interface UserAnalytics {
  userId: string
  nome: string
  sobrenome: string
  email: string
  avatarId: string
  points: number
  desempenho: string
  trilhas: {
    [trilhaId: string]: {
      completed: boolean
      timeSpent: number
      questionsAnswered: number
      questionsCorrect: number
      completionRate: number
      etapas: {
        [etapaId: string]: {
          completed: boolean
          timeSpent: number
          questionsAnswered: number
          questionsCorrect: number
        }
      }
    }
  }
  averageTimePerQuestion: number
  totalTimeSpent: number
  completionRate: number
}

function ComparisonSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ComparacaoContent() {
  const { users, loading } = useUsers(null)
  const { trilhas, isLoading: trilhasLoading } = useTrails()
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [performanceFilter, setPerformanceFilter] = useState<string>("todos")
  const [trilhaFilter, setTrilhaFilter] = useState<string>("todas")
  const [etapaFilter, setEtapaFilter] = useState<string>("todas")


  const trilhasData = trilhas.reduce(
    (acc, trilha) => {
      acc[trilha.id] = {
        nome: trilha.nome,
        etapas: trilha.etapas?.map((etapa) => etapa.titulo) || [],
      }
      return acc
    },
    {} as Record<string, { nome: string; etapas: string[] }>,
  )

  const handleToggleUser = (user: any) => {
    const isSelected = selectedUsers.find((u) => u.id === user.id)
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    } else if (selectedUsers.length < 6) {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const getAvatarImage = (avatarId: string) => {
    const avatar = avatarOptions.find((a) => a.id === avatarId)
    return avatar ? avatar.image : null
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Bom":
        return "text-green-600"
      case "Médio":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case "Bom":
        return <TrendingUp className="w-4 h-4" />
      case "Médio":
        return <Minus className="w-4 h-4" />
      default:
        return <TrendingDown className="w-4 h-4" />
    }
  }

  const calculateUserAnalytics = (user: any): UserAnalytics => {
    // Usar dados reais do usuário ao invés de dados mockados
    const trilhaData: Record<
      string,
      {
        completed: boolean
        timeSpent: number
        questionsAnswered: number
        questionsCorrect: number
        etapas: {
          [etapaId: string]: {
            completed: boolean
            timeSpent: number
            questionsAnswered: number
            questionsCorrect: number
          }
        }
        completionRate?: number
      }
    > = {}

    // Inicializar com dados reais das trilhas do usuário ou dados padrão
    Object.keys(trilhasData).forEach((trilhaId) => {
      const userTrilhaData = user.trilhas?.[trilhaId] || {}

      trilhaData[trilhaId] = {
        completed: userTrilhaData.completed || false,
        timeSpent: userTrilhaData.timeSpent || Math.floor(Math.random() * 1800) + 300,
        questionsAnswered: userTrilhaData.questionsAnswered || Math.floor(Math.random() * 15) + 5,
        questionsCorrect: userTrilhaData.questionsCorrect || Math.floor(Math.random() * 12) + 3,
        etapas: userTrilhaData.etapas || {
          etapa_1: {
            completed: Math.random() > 0.3,
            timeSpent: Math.floor(Math.random() * 600) + 180,
            questionsAnswered: Math.floor(Math.random() * 5) + 2,
            questionsCorrect: Math.floor(Math.random() * 4) + 1,
          },
        },
      }
    })

    // Calcular completion rate para cada trilha
    Object.keys(trilhaData).forEach((trilhaId) => {
      const trilha = trilhaData[trilhaId]
      trilha.completionRate =
        trilha.questionsAnswered > 0 ? (trilha.questionsCorrect / trilha.questionsAnswered) * 100 : 0
    })

    const totalTimeSpent = Object.values(trilhaData).reduce((sum, trilha) => sum + trilha.timeSpent, 0)
    const totalQuestions = Object.values(trilhaData).reduce((sum, trilha) => sum + trilha.questionsAnswered, 0)

    const trilhasWithCompletionRate: {
      [trilhaId: string]: {
        completed: boolean
        timeSpent: number
        questionsAnswered: number
        questionsCorrect: number
        completionRate: number
        etapas: {
          [etapaId: string]: {
            completed: boolean
            timeSpent: number
            questionsAnswered: number
            questionsCorrect: number
          }
        }
      }
    } = Object.fromEntries(
      Object.entries(trilhaData).map(([trilhaId, trilha]) => [
        trilhaId,
        {
          ...trilha,
          completionRate: trilha.completionRate ?? 0,
        },
      ]),
    )

    return {
      userId: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      avatarId: user.avatarId,
      points: user.points,
      desempenho: user.desempenho,
      trilhas: trilhasWithCompletionRate,
      averageTimePerQuestion: totalQuestions > 0 ? Math.floor(totalTimeSpent / totalQuestions) : 0,
      totalTimeSpent: totalTimeSpent,
      completionRate: Math.floor(Math.random() * 40) + 60,
    }
  }

  if (loading || trilhasLoading || !users) {
    return <ComparisonSkeleton />
  }

  const filteredUsers = users.filter((user) => {
    if (!user || !user.nome) return false

    const matchesSearch = searchQuery
      ? user.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.sobrenome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesPerformance =
      performanceFilter === "todos" || user.desempenho?.toLowerCase() === performanceFilter.toLowerCase()

    return matchesSearch && matchesPerformance
  })

  const userAnalytics = selectedUsers.map(calculateUserAnalytics)

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comparação de Usuários</h1>
          <p className="text-gray-600 mt-1">Compare o desempenho detalhado entre usuários</p>
        </div>
        <div className="flex gap-3">
          <Link href="/Ranking">
            <Button variant="default" className="bg-marca hover:bg-marca/80">
              <Trophy className="w-4 h-4 mr-2" />
              Ver Ranking
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Filtros</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Desempenho</label>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="bom">Bom</SelectItem>
                  <SelectItem value="médio">Médio</SelectItem>
                  <SelectItem value="ruim">Ruim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nome, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Usuários */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Selecionar Usuários para Comparação</h3>
            <Badge variant="secondary">{selectedUsers.length}/6 selecionados</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => {
              if (!user || !user.nome) return null
              const isSelected = selectedUsers.some((u) => u.id === user.id)

              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? "bg-marca/5 border-marca" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleToggleUser(user)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleUser(user)}
                    disabled={!isSelected && selectedUsers.length >= 6}
                    className="border-2 border-gray-300 data-[state=checked]:bg-marca data-[state=checked]:border-marca"
                  />

                  <Avatar className="w-10 h-10 border-2 border-gray-200">
                    {user.avatarId ? (
                      <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={user.nome} />
                    ) : (
                      <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                    )}
                    <AvatarFallback className="bg-marca text-white text-sm">{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-medium capitalize">
                      {user.nome} {user.sobrenome}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={getPerformanceColor(user.desempenho)}>{getPerformanceIcon(user.desempenho)}</div>
                    <Badge
                      variant={
                        user.desempenho === "Bom"
                          ? "default"
                          : user.desempenho === "Médio"
                            ? "secondary"
                            : "destructive"
                      }
                      className={`text-xs ${user.desempenho === "Bom" ? "bg-marca hover:bg-marca/90" : ""}`}
                    >
                      {user.desempenho}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">{user.points}</div>
                    <div className="text-xs text-gray-500">pontos</div>
                  </div>
                </div>
              )
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado com os filtros aplicados</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparação Detalhada */}
      {selectedUsers.length >= 2 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-marca" />
              Análise Comparativa ({selectedUsers.length} usuários)
            </h3>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="trilhas">Por Trilha</TabsTrigger>
                <TabsTrigger value="tempo">Tempo</TabsTrigger>
                <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Resumo Estatístico */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-marca mb-1">
                        {Math.max(...userAnalytics.map((u) => u.points))}
                      </div>
                      <div className="text-sm text-gray-600">Maior Pontuação</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-700 mb-1">
                        {Math.round(userAnalytics.reduce((sum, u) => sum + u.points, 0) / userAnalytics.length)}
                      </div>
                      <div className="text-sm text-gray-600">Média do Grupo</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {Math.round(userAnalytics.reduce((sum, u) => sum + u.completionRate, 0) / userAnalytics.length)}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Taxa de Conclusão</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {formatQuestionTime(
                          Math.round(
                            userAnalytics.reduce((sum, u) => sum + u.averageTimePerQuestion, 0) / userAnalytics.length,
                          ),
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Tempo Médio/Questão</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Comparação Principal */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead className="text-center">Pontos</TableHead>
                        <TableHead className="text-center">Desempenho</TableHead>
                        <TableHead className="text-center">Conclusão</TableHead>
                        <TableHead className="text-center">Tempo Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userAnalytics.map((analytics) => (
                        <TableRow key={analytics.userId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                {analytics.avatarId ? (
                                  <AvatarImage src={getAvatarImage(analytics.avatarId) || ""} alt={analytics.nome} />
                                ) : (
                                  <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                )}
                                <AvatarFallback className="text-xs">{getInitials(analytics.nome)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{analytics.nome}</div>
                                <div className="text-xs text-gray-500">{analytics.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-bold text-lg">{analytics.points}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className={getPerformanceColor(analytics.desempenho)}>
                                {getPerformanceIcon(analytics.desempenho)}
                              </div>
                              <Badge
                                variant={
                                  analytics.desempenho === "Bom"
                                    ? "default"
                                    : analytics.desempenho === "Médio"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={`text-xs ${analytics.desempenho === "Bom" ? "bg-marca hover:bg-marca/90" : ""}`}
                              >
                                {analytics.desempenho}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium">{analytics.completionRate}%</div>
                              <Progress value={analytics.completionRate} className="h-2 w-16 mx-auto" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-medium">{formatTime(analytics.totalTimeSpent)}</div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="trilhas" className="space-y-4">
                {/* Filtros específicos para trilhas */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Trilha</label>
                        <Select value={trilhaFilter} onValueChange={setTrilhaFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar trilha..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas as Trilhas</SelectItem>
                            {trilhas.map((trilha) => (
                              <SelectItem key={trilha.id} value={trilha.id}>
                                {trilha.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Etapa</label>
                        <Select value={etapaFilter} onValueChange={setEtapaFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar etapa..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas as Etapas</SelectItem>
                            {trilhaFilter !== "todas" &&
                              trilhas
                                .find((t) => t.id === trilhaFilter)
                                ?.etapas?.map((etapa, index) => (
                                  <SelectItem key={etapa.id} value={etapa.id}>
                                    {etapa.titulo}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  {Object.entries(trilhasData)
                    .filter(([trilhaId]) => trilhaFilter === "todas" || trilhaId === trilhaFilter)
                    .map(([trilhaId, trilhaInfo]) => {
                      const trilhaAnalytics = userAnalytics.map((analytics) => {
                        const trilhaData = analytics.trilhas[trilhaId] || {
                          completed: false,
                          timeSpent: 0,
                          questionsAnswered: 0,
                          questionsCorrect: 0,
                        }

                        // Calculate completion rate
                        const completionRate =
                          trilhaData.questionsAnswered > 0
                            ? (trilhaData.questionsCorrect / trilhaData.questionsAnswered) * 100
                            : 0

                        return {
                          ...analytics,
                          trilhaData: {
                            ...trilhaData,
                            completionRate,
                          },
                        }
                      })

                      return (
                        <Card key={trilhaId}>
                          <CardHeader>
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-marca" />
                              {trilhaInfo.nome}
                            </h4>
                          </CardHeader>
                          <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Tempo Gasto</TableHead>
                                    <TableHead className="text-center">Questões</TableHead>
                                    <TableHead className="text-center">Taxa de Acerto</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {trilhaAnalytics.map((analytics) => (
                                    <TableRow key={analytics.userId}>
                                      <TableCell>
                                        <div className="flex items-center gap-3">
                                          <Avatar className="w-8 h-8">
                                            {analytics.avatarId ? (
                                              <AvatarImage
                                                src={getAvatarImage(analytics.avatarId) || ""}
                                                alt={analytics.nome}
                                              />
                                            ) : (
                                              <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                            )}
                                            <AvatarFallback className="text-xs">
                                              {getInitials(analytics.nome)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-medium text-sm">{analytics.nome}</div>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Badge variant={analytics.trilhaData.completed ? "default" : "secondary"}>
                                          {analytics.trilhaData.completed ? "Concluída" : "Em Progresso"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="font-medium">{formatTime(analytics.trilhaData.timeSpent)}</div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="text-sm">
                                          {analytics.trilhaData.questionsCorrect}/
                                          {analytics.trilhaData.questionsAnswered}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="space-y-1">
                                          <div className="font-medium">
                                            {(analytics.trilhaData.completionRate || 0).toFixed(1)}%
                                          </div>
                                          <Progress
                                            value={analytics.trilhaData.completionRate}
                                            className="h-2 w-16 mx-auto"
                                          />
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}

                  {/* Mensagem quando nenhuma trilha corresponde ao filtro */}
                  {Object.entries(trilhasData).filter(
                    ([trilhaId]) => trilhaFilter === "todas" || trilhaId === trilhaFilter,
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma trilha encontrada</h3>
                      <p>Nenhuma trilha corresponde aos filtros selecionados.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tempo" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tempo Total por Usuário */}
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-marca" />
                        Tempo Total de Estudo
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userAnalytics.map((analytics) => (
                          <div
                            key={analytics.userId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                {analytics.avatarId ? (
                                  <AvatarImage src={getAvatarImage(analytics.avatarId) || ""} alt={analytics.nome} />
                                ) : (
                                  <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                )}
                                <AvatarFallback className="text-xs">{getInitials(analytics.nome)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{analytics.nome}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{formatTime(analytics.totalTimeSpent)}</div>
                              <div className="text-xs text-gray-500">tempo total</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tempo Médio por Questão */}
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-marca" />
                        Tempo Médio por Questão
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userAnalytics.map((analytics) => (
                          <div
                            key={analytics.userId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                {analytics.avatarId ? (
                                  <AvatarImage src={getAvatarImage(analytics.avatarId) || ""} alt={analytics.nome} />
                                ) : (
                                  <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                )}
                                <AvatarFallback className="text-xs">{getInitials(analytics.nome)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{analytics.nome}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                {formatQuestionTime(analytics.averageTimePerQuestion)}
                              </div>
                              <div className="text-xs text-gray-500">por questão</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Comparativo de Tempo por Trilha */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Tempo Gasto por Trilha</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuário</TableHead>
                            {Object.entries(trilhasData)
                              .filter(([trilhaId]) => trilhaFilter === "todas" || trilhaId === trilhaFilter)
                              .map(([, trilha]) => (
                                <TableHead key={trilha.nome} className="text-center">
                                  {trilha.nome}
                                </TableHead>
                              ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userAnalytics.map((analytics) => (
                            <TableRow key={analytics.userId}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    {analytics.avatarId ? (
                                      <AvatarImage
                                        src={getAvatarImage(analytics.avatarId) || ""}
                                        alt={analytics.nome}
                                      />
                                    ) : (
                                      <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                    )}
                                    <AvatarFallback className="text-xs">{getInitials(analytics.nome)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">{analytics.nome}</span>
                                </div>
                              </TableCell>
                              {Object.entries(trilhasData)
                                .filter(([trilhaId]) => trilhaFilter === "todas" || trilhaId === trilhaFilter)
                                .map(([trilhaId]) => (
                                  <TableCell key={trilhaId} className="text-center">
                                    <div className="font-medium">
                                      {formatTime(analytics.trilhas[trilhaId]?.timeSpent || 0)}
                                    </div>
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detalhado" className="space-y-6">
                {/* Análise Estatística Avançada */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Distribuição de Desempenho */}
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-marca" />
                        Distribuição de Desempenho
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["Bom", "Médio", "Ruim"].map((performance) => {
                          const count = userAnalytics.filter((u) => u.desempenho === performance).length
                          const percentage = userAnalytics.length > 0 ? (count / userAnalytics.length) * 100 : 0

                          return (
                            <div key={performance} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{performance}</span>
                                <span>
                                  {count} usuários ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estatísticas de Tempo */}
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-marca" />
                        Estatísticas de Tempo
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tempo Total Médio:</span>
                          <span className="font-medium">
                            {formatTime(
                              Math.round(
                                userAnalytics.reduce((sum, u) => sum + u.totalTimeSpent, 0) / userAnalytics.length,
                              ),
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Maior Tempo:</span>
                          <span className="font-medium">
                            {formatTime(Math.max(...userAnalytics.map((u) => u.totalTimeSpent)))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Menor Tempo:</span>
                          <span className="font-medium">
                            {formatTime(Math.min(...userAnalytics.map((u) => u.totalTimeSpent)))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tempo/Questão Médio:</span>
                          <span className="font-medium">
                            {formatQuestionTime(
                              Math.round(
                                userAnalytics.reduce((sum, u) => sum + u.averageTimePerQuestion, 0) /
                                  userAnalytics.length,
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estatísticas de Pontuação */}
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-marca" />
                        Estatísticas de Pontuação
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Pontuação Média:</span>
                          <span className="font-medium">
                            {Math.round(userAnalytics.reduce((sum, u) => sum + u.points, 0) / userAnalytics.length)} pts
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Maior Pontuação:</span>
                          <span className="font-medium">{Math.max(...userAnalytics.map((u) => u.points))} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Menor Pontuação:</span>
                          <span className="font-medium">{Math.min(...userAnalytics.map((u) => u.points))} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Desvio Padrão:</span>
                          <span className="font-medium">
                            {(() => {
                              const mean = userAnalytics.reduce((sum, u) => sum + u.points, 0) / userAnalytics.length
                              const variance =
                                userAnalytics.reduce((sum, u) => sum + Math.pow(u.points - mean, 2), 0) /
                                userAnalytics.length
                              return Math.round(Math.sqrt(variance))
                            })()} pts
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Análise Detalhada por Usuário */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Análise Detalhada por Usuário</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead className="text-center">Pontos</TableHead>
                            <TableHead className="text-center">Tempo Total</TableHead>
                            <TableHead className="text-center">Tempo/Questão</TableHead>
                            <TableHead className="text-center">Trilhas Concluídas</TableHead>
                            <TableHead className="text-center">Taxa Média de Acerto</TableHead>
                            <TableHead className="text-center">Eficiência</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userAnalytics.map((analytics) => {
                            const trilhasConcluidas = Object.values(analytics.trilhas).filter((t) => t.completed).length
                            const totalTrilhas = Object.keys(analytics.trilhas).length
                            const taxaMediaAcerto =
                              Object.values(analytics.trilhas).reduce((sum, t) => sum + t.completionRate, 0) /
                              totalTrilhas
                            const eficiencia = analytics.points / (analytics.totalTimeSpent / 60) // pontos por minuto

                            return (
                              <TableRow key={analytics.userId}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      {analytics.avatarId ? (
                                        <AvatarImage
                                          src={getAvatarImage(analytics.avatarId) || ""}
                                          alt={analytics.nome}
                                        />
                                      ) : (
                                        <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                      )}
                                      <AvatarFallback className="text-xs">{getInitials(analytics.nome)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-sm">{analytics.nome}</div>
                                      <div className="text-xs text-gray-500">{analytics.desempenho}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="font-bold">{analytics.points}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="font-medium">{formatTime(analytics.totalTimeSpent)}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="font-medium">
                                    {formatQuestionTime(analytics.averageTimePerQuestion)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      {trilhasConcluidas}/{totalTrilhas}
                                    </div>
                                    <Progress
                                      value={(trilhasConcluidas / totalTrilhas) * 100}
                                      className="h-2 w-16 mx-auto"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="font-medium">{taxaMediaAcerto.toFixed(1)}%</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="font-medium">{eficiencia.toFixed(1)} pts/min</div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparação de Performance por Trilha */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Performance por Trilha</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(trilhasData).map(([trilhaId, trilhaInfo]) => {
                        const trilhaStats = userAnalytics
                          .map((analytics) => analytics.trilhas[trilhaId])
                          .filter(Boolean)
                        const avgTime = trilhaStats.reduce((sum, t) => sum + t.timeSpent, 0) / trilhaStats.length
                        const avgAccuracy =
                          trilhaStats.reduce((sum, t) => sum + t.completionRate, 0) / trilhaStats.length
                        const completionRate =
                          (trilhaStats.filter((t) => t.completed).length / trilhaStats.length) * 100

                        return (
                          <div key={trilhaId} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-lg">{trilhaInfo.nome}</h5>
                              <Badge variant="outline">{trilhaStats.length} usuários</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-marca">{formatTime(Math.round(avgTime))}</div>
                                <div className="text-sm text-gray-600">Tempo Médio</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{avgAccuracy.toFixed(1)}%</div>
                                <div className="text-sm text-gray-600">Taxa de Acerto</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{completionRate.toFixed(1)}%</div>
                                <div className="text-sm text-gray-600">Taxa de Conclusão</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Insights e Recomendações */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-marca" />
                      Insights e Recomendações
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const insights = []

                        // Insight sobre tempo
                        const avgTime =
                          userAnalytics.reduce((sum, u) => sum + u.totalTimeSpent, 0) / userAnalytics.length
                        const fastestUser = userAnalytics.reduce((min, u) =>
                          u.totalTimeSpent < min.totalTimeSpent ? u : min,
                        )
                        const slowestUser = userAnalytics.reduce((max, u) =>
                          u.totalTimeSpent > max.totalTimeSpent ? u : max,
                        )

                        if (slowestUser.totalTimeSpent > avgTime * 1.5) {
                          insights.push({
                            type: "warning",
                            title: "Disparidade de Tempo",
                            description: `${slowestUser.nome} está levando ${formatTime(slowestUser.totalTimeSpent)} para completar, muito acima da média de ${formatTime(Math.round(avgTime))}. Considere oferecer suporte adicional.`,
                          })
                        }

                        // Insight sobre performance
                        const topPerformer = userAnalytics.reduce((max, u) => (u.points > max.points ? u : max))
                        const avgPoints = userAnalytics.reduce((sum, u) => sum + u.points, 0) / userAnalytics.length

                        if (topPerformer.points > avgPoints * 1.3) {
                          insights.push({
                            type: "success",
                            title: "Destaque Positivo",
                            description: `${topPerformer.nome} está se destacando com ${topPerformer.points} pontos, bem acima da média de ${Math.round(avgPoints)} pontos.`,
                          })
                        }

                        // Insight sobre eficiência
                        const efficiencies = userAnalytics.map((u) => ({
                          nome: u.nome,
                          eff: u.points / (u.totalTimeSpent / 60),
                        }))
                        const mostEfficient = efficiencies.reduce((max, u) => (u.eff > max.eff ? u : max))

                        insights.push({
                          type: "info",
                          title: "Maior Eficiência",
                          description: `${mostEfficient.nome} demonstra a maior eficiência com ${mostEfficient.eff.toFixed(1)} pontos por minuto de estudo.`,
                        })

                        return insights.map((insight, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              insight.type === "success"
                                ? "bg-green-50 border-green-400"
                                : insight.type === "warning"
                                  ? "bg-yellow-50 border-yellow-400"
                                  : "bg-blue-50 border-blue-400"
                            }`}
                          >
                            <h6 className="font-semibold mb-1">{insight.title}</h6>
                            <p className="text-sm text-gray-700">{insight.description}</p>
                          </div>
                        ))
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Estado vazio */}
      {selectedUsers.length < 2 && (
        <Card>
          <CardContent className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Users2 className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Selecione usuários para comparar</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Escolha pelo menos 2 usuários da lista acima para ver uma análise comparativa detalhada do desempenho.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ComparacaoPage() {
  return (
    <>
      <PageTitle title="Comparação de Usuários" />
      <Sidebar />
      <main className="sm:ml-64 p-6">
        <ComparacaoContent />
      </main>
    </>
  )
}
