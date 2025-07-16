"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/ModalConfirm"
import { BookOpen, ListChecks, Pencil, Plus, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/utils/api"
import { useAuth } from "@/context/authContext"
import type { Trilha } from "@/types/painel"
import { EditTrilhaDialog } from "./editTrilha"
import { ImageSelector } from "@/components/ImageSelector"
import { MobilePreview } from "@/components/MobilePreview"

interface PainelTrilhasProps {
  trilhas: Trilha[]
  refetch: () => Promise<void>
  navigateToEtapas: (trilha: Trilha) => void
}

export function PainelTrilhas({ trilhas, refetch, navigateToEtapas }: PainelTrilhasProps) {
  const { token } = useAuth()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [backgroundSvg, setBackgroundSvg] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingTrilha, setEditingTrilha] = useState<Trilha | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [previewTrilha, setPreviewTrilha] = useState<Trilha | null>(null)

  // Debug: monitorar mudanças nas trilhas
  useEffect(() => {
    console.log("🔄 PainelTrilhas - trilhas atualizadas:", trilhas.length, "trilhas")
  }, [trilhas])

  const totalTrilhas = trilhas.length
  const totalEtapas = trilhas.reduce((total, trilha) => total + (trilha?.etapas?.length || 0), 0)

  function isValidImageUrl(url: string) {
    if (!url.trim()) return true

    // Padrão para URLs normais de imagem
    const normalPattern = /^https?:\/\/.+\.(png|jpe?g|svg)(\?.*)?$/i

    // Padrão para URLs do Firebase Storage
    const firebasePattern =
      /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/[^?]+\?alt=media(&token=[^&]+)?$/i

    const decodedUrl = decodeURIComponent(url)
    return normalPattern.test(decodedUrl) || firebasePattern.test(url)
  }

  async function handleCreateTrail() {
    if (!nome.trim()) return
    try {
      setIsCreating(true)

      if (backgroundSvg.trim() && !isValidImageUrl(backgroundSvg.trim())) {
        toast.error("URL da imagem inválida", {
          description: "Por favor, forneça uma URL válida terminando em .png, .jpg, .jpeg ou .svg.",
        })
        return
      }

      const novaTrilha = {
        id: `trilha_${Date.now() + 1}`,
        nome: nome.trim(),
        descricao: descricao.trim() || "Sem descrição",
        etapas: [],
        image: "",
        backgroundSvg: backgroundSvg.trim(),
      }

      console.log("Nova trilha sendo criada:", novaTrilha)

      await api.trails.create(novaTrilha, token || "")

      // Limpar formulário
      setNome("")
      setDescricao("")
      setBackgroundSvg("")
      setIsDialogOpen(false)

      toast.success("Trilha criada com sucesso!")

      // Aguardar um pouco antes de fazer o refetch
      setTimeout(async () => {
        console.log("🔄 Fazendo refetch após criar trilha...")
        await refetch()
      }, 500)
    } catch (err: any) {
      console.error("Erro ao criar trilha:", err)
      toast.error("Erro ao criar trilha", {
        description: err.message || "Ocorreu um erro ao tentar criar a trilha.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteTrail(trailId: string) {
    try {
      await api.trails.delete(trailId, token || "")
      toast.success("Trilha excluída com sucesso!")
      await refetch()
    } catch (err: any) {
      console.error("Erro ao excluir trilha:", err)
      toast.error("Erro ao excluir trilha", {
        description: err.message || "Não foi possível excluir a trilha.",
      })
    }
  }

  function handleEditClick(trilha: Trilha) {
    setEditingTrilha(trilha)
  }

  function handleCancelEditTrilha() {
    setEditingTrilha(null)
  }

  function handleDialogClose() {
    // Limpar formulário quando fechar o dialog
    setNome("")
    setDescricao("")
    setBackgroundSvg("")
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel de Trilhas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1 items-center bg-marca hover:bg-marca/80 text-white" size="sm">
              <Plus size={16} />
              Adicionar Trilha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Trilha</DialogTitle>
              <DialogDescription>Crie uma nova trilha de aprendizado para seus usuários.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome-trilha">Nome da trilha</Label>
                <Input
                  id="nome-trilha"
                  placeholder="Ex: React Native Básico"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="descricao-trilha">Descrição</Label>
                <Textarea
                  id="descricao-trilha"
                  placeholder="Ex: Aprenda os fundamentos do React Native"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="background-trilha">Imagem de fundo (opcional)</Label>
                <ImageSelector
                  selectedImageUrl={backgroundSvg}
                  onImageSelect={(url) => {
                    console.log("Imagem de fundo selecionada para nova trilha:", url)
                    setBackgroundSvg(url)
                  }}
                  buttonText="Selecionar Imagem de Fundo"
                  placeholder="Nenhuma imagem de fundo selecionada"
                />
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateTrail}
                  disabled={Boolean(isCreating || !nome.trim() || (backgroundSvg && !isValidImageUrl(backgroundSvg)))}
                >
                  {isCreating ? "Criando..." : "Criar trilha"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Trilhas</CardTitle>
            <BookOpen className="h-4 w-4 text-marca" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrilhas}</div>
            <p className="text-xs text-muted-foreground">Trilhas de aprendizado disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Etapas</CardTitle>
            <ListChecks className="h-4 w-4 text-marca" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEtapas}</div>
            <p className="text-xs text-muted-foreground">Etapas de aprendizado cadastradas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trilhas de Aprendizado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Etapas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trilhas.length > 0 ? (
                trilhas.map((trilha) => (
                  <TableRow key={trilha?.id}>
                    <TableCell className="font-medium">{trilha?.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">{trilha?.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{trilha?.etapas?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => navigateToEtapas(trilha)}>
                                <ListChecks size={16} className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Gerenciar Etapas</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setPreviewTrilha(trilha)}>
                                <Eye size={16} className="text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar no App</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => handleEditClick(trilha)}>
                                <Pencil size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar trilha</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ConfirmDialog
                                trigger={
                                  <Button size="icon" variant="ghost">
                                    <Trash2 size={16} className="text-red-500" />
                                  </Button>
                                }
                                title="Confirmar Exclusão"
                                description="Você tem certeza de que deseja excluir esta trilha? Esta ação não pode ser desfeita."
                                onConfirm={() => handleDeleteTrail(trilha.id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir trilha</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                      <p className="text-muted-foreground">Nenhuma trilha cadastrada</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingTrilha && (
        <EditTrilhaDialog editingTrilha={editingTrilha} onCancel={handleCancelEditTrilha} refetch={refetch} />
      )}
      {previewTrilha && (
        <MobilePreview trilha={previewTrilha} isOpen={!!previewTrilha} onClose={() => setPreviewTrilha(null)} />
      )}
    </>
  )
}
