"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { ArrowLeft, FileText, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import type { Trilha, Etapa } from "@/types/painel"
import { IconRenderer, AVAILABLE_ICONS } from "./iconRender"
import { EditEtapaDialog } from "./editEtapa"
import { getAuth } from "firebase/auth"
import { Switch } from "@/components/ui/switch"
import { ImageSelector } from "@/components/ImageSelector"

interface PainelEtapasProps {
  selectedTrilha: Trilha
  refetch: () => Promise<void>
  navigateToTrilhas: () => void
  navigateToStages: (etapa: Etapa) => void
  setSelectedTrilha: (trilha: Trilha) => void
}

export function PainelEtapas({
  selectedTrilha,
  refetch,
  navigateToTrilhas,
  navigateToStages,
  setSelectedTrilha,
}: PainelEtapasProps) {
  const { token } = useAuth()
  const [newEtapa, setNewEtapa] = useState({
    titulo: "",
    descricao: "",
    icon: "book-open",
    iconLibrary: "lucide",
    imageUrl: "",
    useImage: false,
  })
  const [isAddingEtapa, setIsAddingEtapa] = useState(false)
  const [editingEtapa, setEditingEtapa] = useState<Etapa | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleAddEtapa() {
    if (!selectedTrilha || !newEtapa.titulo.trim()) return

    try {
      setIsAddingEtapa(true)

      // Verificar se a imagem está selecionada quando useImage é true
      if (newEtapa.useImage && !newEtapa.imageUrl.trim()) {
        toast.error("Por favor, selecione uma imagem da galeria.")
        setIsAddingEtapa(false)
        return
      }

      const novaEtapa = {
        id: `etapa_${Date.now()}`,
        titulo: newEtapa.titulo.trim(),
        descricao: newEtapa.descricao.trim() || "Sem descrição",
        icon: newEtapa.useImage ? newEtapa.imageUrl.trim() : newEtapa.icon,
        iconLibrary: newEtapa.useImage ? "custom" : "lucide",
        imageUrl: newEtapa.useImage ? newEtapa.imageUrl.trim() : "",
        icone: newEtapa.useImage ? newEtapa.imageUrl.trim() : newEtapa.icon, 
        stages: [],
      }

      console.log("Nova etapa sendo criada:", novaEtapa)

      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: [...(selectedTrilha.etapas || []), novaEtapa],
      }

      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const idToken = await user.getIdToken()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${selectedTrilha.id}.json?auth=${idToken}`,
        {
          method: "PUT",
          body: JSON.stringify(trilhaAtualizada),
        },
      )

      if (!response.ok) {
        throw new Error(`Erro ao atualizar trilha: ${response.statusText}`)
      }

      setSelectedTrilha(trilhaAtualizada)

      // Limpar formulário
      setNewEtapa({
        titulo: "",
        descricao: "",
        icon: "book-open",
        iconLibrary: "lucide",
        imageUrl: "",
        useImage: false,
      })
      setIsDialogOpen(false)

      toast.success("Etapa adicionada com sucesso!")

      await refetch()
    } catch (err: any) {
      console.error("Erro ao adicionar etapa:", err)
      toast.error("Erro ao adicionar etapa", {
        description: err.message || "Não foi possível adicionar a etapa.",
      })
    } finally {
      setIsAddingEtapa(false)
    }
  }

  function handleEditEtapaClick(etapa: Etapa) {
    setEditingEtapa(etapa)
  }

  function handleCancelEditEtapa() {
    setEditingEtapa(null)
  }

  function handleDialogClose() {
    // Limpar formulário quando fechar o dialog
    setNewEtapa({
      titulo: "",
      descricao: "",
      icon: "book-open",
      iconLibrary: "lucide",
      imageUrl: "",
      useImage: false,
    })
    setIsDialogOpen(false)
  }

  async function handleDeleteEtapa(etapaId: string) {
    if (!selectedTrilha) return

    try {
      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.filter((etapa) => etapa.id !== etapaId),
      }

      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const idToken = await user.getIdToken()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${selectedTrilha.id}.json?auth=${idToken}`,
        {
          method: "PUT",
          body: JSON.stringify(trilhaAtualizada),
        },
      )

      if (!response.ok) {
        throw new Error(`Erro ao atualizar trilha: ${response.statusText}`)
      }

      setSelectedTrilha(trilhaAtualizada)

      toast.success("Etapa excluída com sucesso!")
    
      await refetch()
    } catch (err: any) {
      console.error("Erro ao excluir etapa:", err)
      toast.error("Erro ao excluir etapa", {
        description: err.message || "Não foi possível excluir a etapa.",
      })
    }
  }

  const usesImage = (etapa: Etapa) => {
    return etapa.iconLibrary === "custom"
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigateToTrilhas} className="flex items-center gap-1">
            <ArrowLeft size={14} />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            Etapas: <span className="text-marca">{selectedTrilha.nome}</span>
          </h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1 items-center" size="sm">
              <Plus size={16} />
              Adicionar Etapa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Etapa</DialogTitle>
              <DialogDescription>Adicione uma nova etapa à trilha {selectedTrilha.nome}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo-etapa">Título da etapa</Label>
                <Input
                  id="titulo-etapa"
                  placeholder="Ex: Componentes Básicos"
                  value={newEtapa.titulo}
                  onChange={(e) => setNewEtapa({ ...newEtapa, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="descricao-etapa">Descrição</Label>
                <Textarea
                  id="descricao-etapa"
                  placeholder="Ex: Aprenda sobre os componentes fundamentais"
                  value={newEtapa.descricao}
                  onChange={(e) => setNewEtapa({ ...newEtapa, descricao: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-image"
                  checked={newEtapa.useImage}
                  onCheckedChange={(checked) => setNewEtapa({ ...newEtapa, useImage: checked })}
                />
                <Label htmlFor="use-image">Usar imagem em vez de ícone</Label>
              </div>
              {!newEtapa.useImage ? (
                <div className="space-y-2">
                  <Label htmlFor="icon-etapa">Ícone</Label>
                  <Select value={newEtapa.icon} onValueChange={(value) => setNewEtapa({ ...newEtapa, icon: value })}>
                    <SelectTrigger id="icon-etapa">
                      <SelectValue placeholder="Selecione um ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            {icon.icon && <icon.icon className="h-4 w-4" />}
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="image-url">Imagem da Etapa</Label>
                  <ImageSelector
                    selectedImageUrl={newEtapa.imageUrl}
                    onImageSelect={(url) => {
                      console.log("Imagem selecionada para nova etapa:", url)
                      setNewEtapa({ ...newEtapa, imageUrl: url })
                    }}
                    buttonText="Selecionar Imagem"
                    placeholder="Nenhuma imagem selecionada"
                  />
                 
                </div>
              )}
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddEtapa} 
                  disabled={isAddingEtapa || !newEtapa.titulo.trim()} 
                >
                  {isAddingEtapa ? "Adicionando..." : "Adicionar etapa"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Etapas da Trilha</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ícone</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Stages</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTrilha.etapas && selectedTrilha.etapas.length > 0 ? (
                selectedTrilha.etapas.map((etapa) => (
                  <TableRow key={etapa.id}>
                    <TableCell>
                      <div className="bg-blue-100 p-1.5 rounded-full w-8 h-8 flex items-center justify-center">
                        {usesImage(etapa) ? (
                          <img src={etapa.icon || "/placeholder.svg"} className="h-5 w-5 object-contain" />
                        ) : (
                          <IconRenderer iconName={etapa.icon} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{etapa.titulo}</TableCell>
                    <TableCell className="max-w-xs truncate">{etapa.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{etapa.stages?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => navigateToStages(etapa)}>
                                <FileText size={16} className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Gerenciar Stages</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => handleEditEtapaClick(etapa)}>
                                <Pencil size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar etapa</p>
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
                                description="Você tem certeza de que deseja excluir esta etapa? Esta ação não pode ser desfeita."
                                onConfirm={() => handleDeleteEtapa(etapa.id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir etapa</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <p className="text-muted-foreground">Nenhuma etapa cadastrada</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingEtapa && (
        <EditEtapaDialog
          selectedTrilha={selectedTrilha}
          editingEtapa={editingEtapa}
          onCancel={handleCancelEditEtapa}
          refetch={refetch}
          setSelectedTrilha={setSelectedTrilha}
        />
      )}
    </>
  )
}
