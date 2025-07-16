"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Star, Crown, Search, Filter, BarChart3 } from 'lucide-react'
import { useUsers } from "@/hooks/useUsers"
import { Sidebar } from "@/components/sidebar"
import { PageTitle } from "@/components/Head"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import Link from "next/link"

const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

const rankingConfig = {
  1: {
    icon: Crown,
    bgClass: "bg-marca",
    textClass: "text-white",
    borderClass: "border-marca/30",
    badgeClass: "bg-white/20 text-white",
    height: "h-80",
  },
  2: {
    icon: Medal,
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
    borderClass: "border-gray-200",
    badgeClass: "bg-gray-200/50 text-gray-700",
    height: "h-72",
  },
  3: {
    icon: Award,
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
    borderClass: "border-gray-200",
    badgeClass: "bg-gray-200/50 text-gray-700",
    height: "h-64",
  },
}

function RankingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-end justify-center gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                <Skeleton className="h-6 w-16 mx-auto" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
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

function RankingCard({
  user,
  position,
}: {
  user: any
  position: 1 | 2 | 3
}) {
  const config = rankingConfig[position] || {
    icon: Star,
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
    borderClass: "border-gray-200",
    badgeClass: "bg-gray-200/50 text-gray-700",
    height: "h-56",
  }

  const PositionIcon = config.icon

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

  return (
    <div className="flex flex-col items-center group">
      <div
        className={`
          relative w-44 ${config.height} 
          ${config.bgClass}
          rounded-xl shadow-lg
          flex flex-col items-center justify-between
          p-6 ${config.textClass}
          transition-all duration-300 hover:scale-105 hover:shadow-xl
          border-2 ${config.borderClass}
        `}
      >
        {/* Header com ícone */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className={`w-16 h-16 border-3 ${config.borderClass} shadow-md`}>
              {user.avatarId ? (
                <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={`Avatar de ${user.nome}`} />
              ) : (
                <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
              )}
              <AvatarFallback className="bg-white text-gray-800 font-bold text-sm">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md">
              <PositionIcon className="w-4 h-4 text-gray-700" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-base font-bold capitalize leading-tight max-w-[140px] truncate">
              {user.nome} {user.sobrenome}
            </h4>
          </div>
        </div>

        {/* Pontuação central */}
        <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold leading-none">{user.points}</div>
            <div className="text-sm font-medium opacity-90 mt-1">Pontos</div>
          </div>
        </div>

        {/* Badge de desempenho */}
        <div className="w-full">
          <div className={`${config.badgeClass} rounded-lg px-3 py-2 text-center`}>
            <span className="text-xs font-semibold">{user.desempenho}</span>
          </div>
        </div>
      </div>

      {/* Posição */}
      <div className="mt-4 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border-2 border-gray-200">
        <span className="text-gray-700 font-bold text-sm">#{position}</span>
      </div>
    </div>
  )
}

function RankingContent() {
  const { users, loading } = useUsers(null)
  const [performanceFilter, setPerformanceFilter] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState<string>("")

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

  if (loading || !users) {
    return <RankingSkeleton />
  }

  const rankedUsers = [...(users || [])].sort((a, b) => b.points - a.points)
  const top3 = rankedUsers.slice(0, 3)
  const restOfUsers = rankedUsers.slice(3)

  // Filtrar apenas os usuários da tabela (a partir da 4ª posição)
  const filteredRestUsers = restOfUsers.filter((user) => {
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

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ranking de Usuários</h1>
          <p className="text-gray-600 mt-1">Confira os usuários com melhor desempenho da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Link href="/Comparacao">
            <Button className="bg-marca hover:bg-marca/90">
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparar Usuários
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Top 3 */}
          {top3.length > 0 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-1 bg-gradient-to-r from-marca to-marca/60 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-marca" />
                    Top 3 Performers
                  </h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-marca to-marca/60 rounded-full"></div>
                </div>
                <p className="text-gray-600">Os melhores usuários da plataforma</p>
              </div>

              <div className="flex justify-center items-end gap-8 px-4">
                {([2, 1, 3] as const).map((position) => {
                  const user = top3[position - 1]
                  if (!user || !user.nome) return null
                  return (
                    <RankingCard
                      key={user.id}
                      user={user}
                      position={position}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Separador */}
          {top3.length > 0 && restOfUsers.length > 0 && (
            <div className="flex items-center gap-6 py-8">
              <Separator className="flex-1" />
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Demais Usuários</span>
              </div>
              <Separator className="flex-1" />
            </div>
          )}

          {/* Tabela completa */}
          {restOfUsers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Ranking Completo</h3>
                <Badge variant="secondary" className="text-sm">
                  {filteredRestUsers.length} de {restOfUsers.length} usuários
                </Badge>
              </div>

              {/* Barra de pesquisa e filtros - apenas para a tabela */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Pesquisar na tabela..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                    <SelectTrigger className="w-[140px]">
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
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-center">Posição</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden sm:table-cell text-center">Desempenho</TableHead>
                      <TableHead className="text-right">Pontos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRestUsers.length > 0 ? (
                      filteredRestUsers.map((user) => {
                        if (!user || !user.nome) return null
                        const position = rankedUsers.findIndex((u) => u.id === user.id) + 1

                        return (
                          <TableRow key={user.id}>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                  #{position}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-4">
                                <Avatar className="w-10 h-10 border-2 border-gray-200">
                                  {user.avatarId ? (
                                    <AvatarImage
                                      src={getAvatarImage(user.avatarId) || ""}
                                      alt={`Avatar de ${user.nome}`}
                                    />
                                  ) : (
                                    <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
                                  )}
                                  <AvatarFallback className="bg-marca text-white text-sm font-bold">
                                    {getInitials(user.nome)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-semibold capitalize text-gray-800">
                                    {user.nome} {user.sobrenome}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="hidden md:table-cell text-gray-600">{user.email}</TableCell>

                            <TableCell className="hidden sm:table-cell text-center">
                              <Badge
                                variant={
                                  user.desempenho === "Bom"
                                    ? "default"
                                    : user.desempenho === "Médio"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={`text-xs font-medium ${
                                  user.desempenho === "Bom" ? "bg-marca hover:bg-marca/90" : ""
                                }`}
                              >
                                {user.desempenho}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <span className="font-bold text-lg text-gray-800">{user.points}</span>
                              <span className="text-sm text-gray-500 ml-1">pts</span>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {searchQuery || performanceFilter !== "todos"
                            ? "Nenhum usuário encontrado com os filtros aplicados"
                            : "Nenhum usuário encontrado"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Estado vazio geral */}
          {rankedUsers.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Nenhum usuário encontrado</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ainda não há usuários cadastrados na plataforma. Quando houver dados, o ranking aparecerá aqui.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function RankingPage() {
  return (
    <>
      <PageTitle title="Ranking" />
      <Sidebar />
      <main className="sm:ml-64 p-6">
        <RankingContent />
      </main>
    </>
  )
}
