"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/hooks/useUsers"
import { UsuariosSkeleton } from "../skeletons/usuariosSkeleton"

// Array de avatares disponíveis
const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

export default function DashUsuarios() {
  const { users, loading } = useUsers(5)

  // Função para formatar a data de último acesso
  const formatLastAccess = (lastAccess: string | number | Date) => {
    if (!lastAccess) return "Nunca acessou"

    try {
      let date: Date

      // Se for string, tentar converter
      if (typeof lastAccess === "string") {
        // Se já estiver formatada (dd/mm/yyyy às hh:mm), retornar como está
        if (lastAccess.includes("/") && lastAccess.includes("às")) {
          return lastAccess
        }
        // Tentar converter string para número
        const timestamp = Number.parseInt(lastAccess)
        if (isNaN(timestamp)) return "Data inválida"
        date = new Date(timestamp)
      }
      // Se for número, usar diretamente
      else if (typeof lastAccess === "number") {
        date = new Date(lastAccess)
      }
      // Se for Date, usar diretamente
      else if (lastAccess instanceof Date) {
        date = lastAccess
      } else {
        return "Data inválida"
      }

      // Verificar se a data é válida
      if (isNaN(date.getTime())) return "Data inválida"

      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Erro ao formatar data:", error, "Valor recebido:", lastAccess)
      return "Erro ao formatar data"
    }
  }

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Função para obter a imagem do avatar com base no ID
  const getAvatarImage = (avatarId: string) => {
    const avatar = avatarOptions.find((a) => a.id === avatarId)
    return avatar ? avatar.image : null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-800">
            Usuários Recentes<span className="text-marca">.</span>
          </CardTitle>
          <Users className="w-5 h-5 text-gray-600" />
        </div>
        <CardDescription>Últimos 5 usuários cadastrados na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <UsuariosSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead className="text-right">Desempenho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.avatarId ? (
                          <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={`Avatar de ${user.nome}`} />
                        ) : (
                          <AvatarImage src="/avatars/avatar1.png" alt={`Avatar padrão`} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-xs text-muted-foreground">{user.phone || "Sem telefone"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.points || 0}</TableCell>
                    <TableCell>{formatLastAccess(user.ultimoAcesso)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            user.desempenho === "Bom"
                              ? "bg-green-500"
                              : user.desempenho === "Médio"
                                ? "bg-yellow-400"
                                : "bg-red-500"
                          }`}
                        />
                        {user.desempenho || "Não avaliado"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
