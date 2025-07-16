"use client"

import { MessageSquare, Pencil, Trash2, Users, FileText, FileSpreadsheet } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/hooks/useUsers"
import SearchInput from "@/components/Busca"
import CustomPagination from "@/components/Paginacao"
import { UsuariosSkeleton } from "../skeletons/usuariosSkeleton"
import { Button } from "@/components/ui/button"
import { ref, remove } from "firebase/database"
import { database } from "@/services/firebase"
import { ConfirmDialog } from "@/components/ModalConfirm"
import { generateUserPDF, generateUserListPDF } from "@/utils/pdf"
import type { UserData } from "@/types/user"


const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

export default function UsuariosTotal() {
  const router = useRouter()
  const { users, loading, setUsers } = useUsers(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const usersPerPage = 10

  const filteredUsers = useMemo(() => {
    return users.filter((user) => user.nome.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [users, searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage
    return filteredUsers.slice(startIndex, startIndex + usersPerPage)
  }, [filteredUsers, currentPage])

  const handlePageChange = (page: number) => setCurrentPage(page)

  // Função para excluir o usuário
  const handleDeleteUser = async () => {
    if (deleteUserId) {
      try {
        await remove(ref(database, `users/${deleteUserId}`))

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId))
      } catch (error) {
        console.error("Erro ao excluir usuário.", error)
      }
    }
  }

  // Função para gerar PDF do usuário
  const handleGenerateUserPDF = (user: UserData) => {
    generateUserPDF(user)
  }

  // Função para gerar PDF com lista completa de usuários
  const handleGenerateUserListPDF = () => {
    generateUserListPDF(users)
  }

  // Função para navegar para edição do usuário
  const handleEditUser = (userId: string) => {
    router.push(`/Usuarios/editar?id=${userId}`)
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
    <Card className="flex-1 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex text-lg sm:text-xl text-gray-800">
            Usuários Total<span className="text-marca block">.</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateUserListPDF}
              className="flex items-center gap-2 bg-marca hover:bg-marca/80 text-white"
              size="sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Gerar Lista Completa PDF
            </Button>
           
          </div>
        </div>
        <CardDescription>Atualizado às {new Date().toLocaleTimeString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <SearchInput
          label="Buscar usuário"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="busca-usuarios"
        />

        {loading ? (
          <UsuariosSkeleton />
        ) : (
          <>
            {currentUsers.length === 0 ? (
              <p className="text-center">Nenhum usuário encontrado.</p>
            ) : (
              <Table className="w-full text-sm overflow-visible">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Nome</TableHead>
                    <TableHead className="w-1/4">Email</TableHead>
                    <TableHead className="w-1/4">Telefone</TableHead>
                    <TableHead className="text-center w-1/4">Último acesso</TableHead>
                    <TableHead className="text-center w-1/4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="uppercase">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            {user.avatarId ? (
                              <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={`Avatar de ${user.nome}`} />
                            ) : (
                              <AvatarImage src="/avatars/avatar1.png" alt={`Avatar padrão`} />
                            )}
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(user.nome)}
                            </AvatarFallback>
                          </Avatar>
                          {user.nome}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-center text-xs">{user.ultimoAcesso}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          {/* Botão Editar - Atualizado para usar query parameters */}
                          <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                            <Pencil size={12} />
                          </Button>

                          {/* Botão Excluir */}
                          <ConfirmDialog
                            trigger={
                              <Button size="sm" variant="destructive" onClick={() => setDeleteUserId(user.id)}>
                                <Trash2 size={12} />
                              </Button>
                            }
                            title="Confirmar Exclusão"
                            description="Você tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita."
                            onConfirm={handleDeleteUser}
                          />

                          {/* Botão WhatsApp */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-marca2 text-white hover:bg-marca2/80 hover:text-white"
                            onClick={() => {
                              const phoneNumber = user.phone.replace(/\D/g, "")
                              const message = encodeURIComponent(
                                "Olá! Estou entrando em contato com você pelo dashboard.",
                              )
                              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
                              window.open(whatsappUrl, "_blank")
                            }}
                          >
                            <MessageSquare size={12} />
                          </Button>

                          {/* Botão PDF do usuário */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => handleGenerateUserPDF(user)}
                          >
                            <FileText size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {currentUsers.length >= 1 && (
              <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
