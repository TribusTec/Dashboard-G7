"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, Check, Clock, FileText, HelpCircle, Pencil, Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import type { Trilha, Etapa, Stage } from "@/types/painel"
import { IconRenderer } from "./iconRender"
import { EditStageDialog } from "./editStage"
import { getAuth } from "firebase/auth"

interface PainelStagesProps {
  selectedTrilha: Trilha
  selectedEtapa: Etapa
  refetch: () => Promise<void>
  navigateToEtapas: (trilha: Trilha) => void
  navigateToQuestions: (stage: Stage) => void
  setSelectedTrilha: (trilha: Trilha) => void
  setSelectedEtapa: (etapa: Etapa) => void
}

export function PainelStages({
  selectedTrilha,
  selectedEtapa,
  refetch,
  navigateToEtapas,
  navigateToQuestions,
  setSelectedTrilha,
  setSelectedEtapa,
}: PainelStagesProps) {
  const { token } = useAuth()
  const [newStage, setNewStage] = useState<Partial<Stage>>({
    title: "",
    description: "",
    tempo_estimado: "",
    image: "",
    video: "",
    pontos_chave: [],
    questions: [],
  })
  const [isAddingStage, setIsAddingStage] = useState(false)
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [newPontoChave, setNewPontoChave] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  async function handleAddStage() {
    if (!selectedTrilha || !selectedEtapa || !newStage.title?.trim()) return

    try {
      setIsAddingStage(true)

      const novoStage: Stage = {
        id: `stage_${Date.now()}`,
        title: newStage.title.trim(),
        description: newStage.description?.trim() || "Sem descrição",
        tempo_estimado: newStage.tempo_estimado?.trim(),
        image: newStage.image?.trim() || "",
        video: newStage.video?.trim() || "",
        pontos_chave: newStage.pontos_chave || [],
        questions: [],
        ordem: 0,
        completed: undefined
      }

      // Criar cópia da etapa com o novo stage
      const etapaAtualizada = {
        ...selectedEtapa,
        stages: [...(selectedEtapa.stages || []), novoStage],
      }

      // Criar cópia da trilha com a etapa atualizada
      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) => (etapa.id === selectedEtapa.id ? etapaAtualizada : etapa)),
      }

      // Obter o token de autenticação do Firebase
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const idToken = await user.getIdToken()

      // Atualizar diretamente no Firebase
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

      // Atualizar estados locais
      setSelectedTrilha(trilhaAtualizada)
      setSelectedEtapa(etapaAtualizada)

      // Resetar o formulário
      setNewStage({
        title: "",
        description: "",
        tempo_estimado: "",
        image: "",
        video: "",
        pontos_chave: [],
        questions: [],
      })
      setNewPontoChave("")

      // Fechar o modal
      setIsAddDialogOpen(false)

      toast.success("Stage adicionado com sucesso!")
    } catch (err: any) {
      console.error("Erro ao adicionar stage:", err)
      toast.error("Erro ao adicionar stage", {
        description: err.message || "Não foi possível adicionar o stage.",
      })
    } finally {
      setIsAddingStage(false)
    }
  }

  function handleEditStageClick(stage: Stage) {
    setEditingStage(stage)
  }

  function handleCancelEditStage() {
    setEditingStage(null)
  }

  async function handleDeleteStage(stageId: string) {
    if (!selectedTrilha || !selectedEtapa) return

    try {
      // Criar cópia da etapa sem o stage excluído
      const etapaAtualizada = {
        ...selectedEtapa,
        stages: selectedEtapa.stages.filter((stage) => stage.id !== stageId),
      }

      // Criar cópia da trilha com a etapa atualizada
      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) => (etapa.id === selectedEtapa.id ? etapaAtualizada : etapa)),
      }

      // Obter o token de autenticação do Firebase
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const idToken = await user.getIdToken()

      // Atualizar diretamente no Firebase
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

      // Atualizar estados locais
      setSelectedTrilha(trilhaAtualizada)
      setSelectedEtapa(etapaAtualizada)

      toast.success("Stage excluído com sucesso!")
    } catch (err: any) {
      console.error("Erro ao excluir stage:", err)
      toast.error("Erro ao excluir stage", {
        description: err.message || "Não foi possível excluir o stage.",
      })
    }
  }

  // Funções para gerenciar pontos-chave
  function handleAddPontoChave() {
    if (!newPontoChave.trim()) return

    setNewStage({
      ...newStage,
      pontos_chave: [...(newStage.pontos_chave || []), newPontoChave.trim()],
    })

    setNewPontoChave("")
  }

  function handleRemovePontoChave(index: number) {
    const pontosAtualizados = [...(newStage.pontos_chave || [])]
    pontosAtualizados.splice(index, 1)
    setNewStage({
      ...newStage,
      pontos_chave: pontosAtualizados,
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToEtapas(selectedTrilha)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IconRenderer iconName={selectedEtapa.icon} />
            <span>
              Stages: <span className="text-marca">{selectedEtapa.titulo}</span>
            </span>
          </h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1 items-center" size="sm">
              <Plus size={16} />
              Adicionar Stage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Novo Stage</DialogTitle>
              <DialogDescription>Adicione um novo stage à etapa {selectedEtapa.titulo}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="media">Mídia</TabsTrigger>
                  <TabsTrigger value="pontos">Pontos-Chave</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title-stage">Título do stage</Label>
                    <Input
                      id="title-stage"
                      placeholder="Ex: Introdução aos Componentes"
                      value={newStage.title || ""}
                      onChange={(e) => setNewStage({ ...newStage, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description-stage">Descrição</Label>
                    <Textarea
                      id="description-stage"
                      placeholder="Ex: Conceitos básicos de componentes React Native"
                      value={newStage.description || ""}
                      onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="tempo-stage">Tempo estimado</Label>
                      <Input
                        id="tempo-stage"
                        placeholder="Ex: 15-20 minutos"
                        value={newStage.tempo_estimado || ""}
                        onChange={(e) => setNewStage({ ...newStage, tempo_estimado: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="media" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="image-stage">URL da imagem</Label>
                      <Input
                        id="image-stage"
                        placeholder="Ex: https://reactnative.dev/img/tiny_logo.png"
                        value={newStage.image || ""}
                        onChange={(e) => setNewStage({ ...newStage, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="video-stage">URL do vídeo</Label>
                      <Input
                        id="video-stage"
                        placeholder="Ex: https://www.youtube.com/watch?v=0-S5a0eXPoc"
                        value={newStage.video || ""}
                        onChange={(e) => setNewStage({ ...newStage, video: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="pontos" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="ponto-chave">Adicionar ponto-chave</Label>
                      <div className="flex gap-2">
                        <Input
                          id="ponto-chave"
                          placeholder="Ex: Entender o que são componentes no React Native"
                          value={newPontoChave}
                          onChange={(e) => setNewPontoChave(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddPontoChave()}
                        />
                        <Button type="button" size="sm" onClick={handleAddPontoChave} disabled={!newPontoChave.trim()}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    {newStage.pontos_chave && newStage.pontos_chave.length > 0 ? (
                      newStage.pontos_chave.map((ponto, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{ponto}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemovePontoChave(index)}>
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum ponto-chave adicionado.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddStage} disabled={isAddingStage || !newStage.title?.trim()}>
                  {isAddingStage ? "Adicionando..." : "Adicionar stage"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stages da Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Questões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedEtapa.stages && selectedEtapa.stages.length > 0 ? (
                selectedEtapa.stages.map((stage) => (
                  <TableRow key={stage.id}>
                    <TableCell className="font-medium">{stage.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{stage.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{stage.tempo_estimado}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{stage.questions?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => navigateToQuestions(stage)}>
                                <HelpCircle size={16} className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Gerenciar Questões</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => handleEditStageClick(stage)}>
                                <Pencil size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar stage</p>
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
                                description="Você tem certeza de que deseja excluir este stage? Esta ação não pode ser desfeita."
                                onConfirm={() => handleDeleteStage(stage.id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir stage</p>
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
                      <p className="text-muted-foreground">Nenhum stage cadastrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingStage && (
        <EditStageDialog
          selectedTrilha={selectedTrilha}
          selectedEtapa={selectedEtapa}
          editingStage={editingStage}
          onCancel={handleCancelEditStage}
          refetch={refetch}
          setSelectedTrilha={setSelectedTrilha}
          setSelectedEtapa={setSelectedEtapa}
        />
      )}
    </>
  )
}
