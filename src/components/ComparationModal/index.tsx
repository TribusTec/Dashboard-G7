"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, BarChart3, Trophy, Users2, Target, Zap } from "lucide-react"

const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

interface UserComparisonModalProps {
  users: any[]
  isOpen: boolean
  onClose: () => void
  rankedUsers: any[]
}

export function UserComparisonModal({ users, isOpen, onClose, rankedUsers }: UserComparisonModalProps) {
  if (!users || users.length === 0) {
    return null
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

  const getUserPosition = (user: any) => {
    return rankedUsers.findIndex((u) => u.id === user.id) + 1
  }

  const sortedUsers = [...users].filter((user) => user && user.points !== undefined).sort((a, b) => b.points - a.points)
  const validUsers = users.filter((user) => user && user.points !== undefined)
  const maxPoints = validUsers.length > 0 ? Math.max(...validUsers.map((u) => u.points)) : 0
  const minPoints = validUsers.length > 0 ? Math.min(...validUsers.map((u) => u.points)) : 0
  const avgPoints =
    validUsers.length > 0 ? Math.round(validUsers.reduce((sum, u) => sum + u.points, 0) / validUsers.length) : 0

  // Estatísticas adicionais
  const performanceDistribution = {
    Bom: users.filter((u) => u && u.desempenho === "Bom").length,
    Médio: users.filter((u) => u && u.desempenho === "Médio").length,
    Ruim: users.filter((u) => u && u.desempenho === "Ruim").length,
  }

  const pointsRange = maxPoints - minPoints
  const leader = sortedUsers[0]
  const topPositions = users.filter((u) => getUserPosition(u) <= 3).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-marca rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Comparação de Usuários
          </DialogTitle>
          <p className="text-gray-600">Análise detalhada entre {users.length} usuários selecionados</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Estatístico */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-marca mb-1">{maxPoints}</div>
                <div className="text-sm text-gray-600">Maior Pontuação</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-700 mb-1">{avgPoints}</div>
                <div className="text-sm text-gray-600">Média do Grupo</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">{pointsRange}</div>
                <div className="text-sm text-gray-600">Diferença Total</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600 mb-1">{topPositions}</div>
                <div className="text-sm text-gray-600">No Top 3 Geral</div>
              </CardContent>
            </Card>
          </div>

          {/* Comparação Principal */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users2 className="w-5 h-5 text-marca" />
                Comparação Detalhada
              </h3>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Posição</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Usuário</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Pontos</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Desempenho</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Vs. Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user, index) => {
                      if (!user || !user.nome) return null
                      const globalPosition = getUserPosition(user)
                      const isLeader = index === 0

                      return (
                        <tr key={user.id} className={isLeader ? "bg-marca/5" : "border-t"}>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  globalPosition === 1
                                    ? "bg-marca text-white"
                                    : globalPosition <= 3
                                      ? "bg-gray-200 text-gray-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                #{globalPosition}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border-2 border-gray-200">
                                {user.avatarId ? (
                                  <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={user.nome} />
                                ) : (
                                  <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                )}
                                <AvatarFallback className="bg-marca text-white text-sm">
                                  {getInitials(user.nome)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium capitalize">
                                  {user.nome} {user.sobrenome}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="font-bold text-lg">{user.points}</div>
                            <div className="mt-1">
                              <Progress value={(user.points / maxPoints) * 100} className="h-2 w-20 mx-auto" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className={getPerformanceColor(user.desempenho)}>
                                {getPerformanceIcon(user.desempenho)}
                              </div>
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
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div
                              className={`text-sm font-medium ${
                                user.points > avgPoints
                                  ? "text-green-600"
                                  : user.points < avgPoints
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {user.points > avgPoints ? "+" : ""}
                              {user.points - avgPoints} pts
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Análises Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de Desempenho */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-marca" />
                  Distribuição de Desempenho
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(performanceDistribution).map(([performance, count]) => {
                  if (count === 0) return null
                  const percentage = Math.round((count / users.length) * 100)

                  return (
                    <div key={performance} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={getPerformanceColor(performance)}>{getPerformanceIcon(performance)}</div>
                          <span className="font-medium">{performance}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Insights do Grupo */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-marca" />
                  Insights do Grupo
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900 mb-1">Líder do Grupo</div>
                  <div className="text-sm text-blue-700">
                    {leader.nome} está na posição #{getUserPosition(leader)} geral com {leader.points} pontos
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900 mb-1">Variação de Pontos</div>
                  <div className="text-sm text-green-700">
                    Diferença de {pointsRange} pontos entre o maior e menor pontuador
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900 mb-1">Posições de Elite</div>
                  <div className="text-sm text-purple-700">
                    {topPositions} usuário{topPositions !== 1 ? "s" : ""} no Top 3 do ranking geral
                  </div>
                </div>

                {performanceDistribution.Bom > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-900 mb-1">Alto Desempenho</div>
                    <div className="text-sm text-yellow-700">
                      {Math.round((performanceDistribution.Bom / users.length) * 100)}% do grupo tem desempenho "Bom"
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Diferenças Detalhadas */}
          {sortedUsers.length > 1 && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-marca" />
                  Diferenças para o Líder
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedUsers.slice(1).map((user) => {
                    const difference = leader.points - user.points
                    const percentageDiff = Math.round((difference / leader.points) * 100)

                    return (
                      <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          {user.avatarId ? (
                            <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={user.nome} />
                          ) : (
                            <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                          )}
                          <AvatarFallback className="text-xs">{getInitials(user.nome)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.nome}</div>
                          <div className="text-xs text-gray-500">#{getUserPosition(user)} posição geral</div>
                        </div>

                        <div className="flex-1">
                          <Progress value={(user.points / leader.points) * 100} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {Math.round((user.points / leader.points) * 100)}% do líder
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-red-600 font-medium">-{difference} pts</div>
                          <div className="text-xs text-gray-500">{percentageDiff}% menor</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} className="bg-marca hover:bg-marca/90 text-white">
              Fechar Comparação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
