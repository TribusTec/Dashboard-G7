"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import type { Trilha, Etapa, Stage } from "@/types/painel"
import { getAuth } from "firebase/auth"

interface EditStageDialogProps {
  selectedTrilha: Trilha
  selectedEtapa: Etapa
  editingStage: Stage
  onCancel: () => void
  refetch: () => Promise<void>
  setSelectedTrilha: (trilha: Trilha) => void
  setSelectedEtapa: (etapa: Etapa) => void
}

export function EditStageDialog({
  selectedTrilha,
  selectedEtapa,
  editingStage,
  onCancel,
  refetch,
  setSelectedTrilha,
  setSelectedEtapa,
}: EditStageDialogProps) {
  const { token } = useAuth()
  const [editStageData, setEditStageData] = useState<Stage>({ ...editingStage })
  const [newPontoChave, setNewPontoChave] = useState("")
  const [isUpdatingStage, setIsUpdatingStage] = useState(false)

  async function handleUpdateStage() {
    if (!selectedTrilha || !selectedEtapa || !editStageData.title?.trim()) return

    try {
      setIsUpdatingStage(true)

      // Criar cópia da etapa com o stage atualizado
      const etapaAtualizada = {
        ...selectedEtapa,
        stages: selectedEtapa.stages.map((stage) => (stage.id === editingStage.id ? editStageData : stage)),
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
      onCancel()

      toast.success("Stage atualizado com sucesso!")

      // await refetch()
    } catch (err: any) {
      console.error("Erro ao atualizar stage:", err)
      toast.error("Erro ao atualizar stage", {
        description: err.message || "Não foi possível atualizar o stage.",
      })
    } finally {
      setIsUpdatingStage(false)
    }
  }

  // Funções para gerenciar pontos-chave
  function handleAddPontoChave() {
    if (!newPontoChave.trim()) return

    setEditStageData({
      ...editStageData,
      pontos_chave: [...(editStageData.pontos_chave || []), newPontoChave.trim()],
    })

    setNewPontoChave("")
  }

  function handleRemovePontoChave(index: number) {
    const pontosAtualizados = [...(editStageData.pontos_chave || [])]
    pontosAtualizados.splice(index, 1)
    setEditStageData({
      ...editStageData,
      pontos_chave: pontosAtualizados,
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Stage</DialogTitle>
          <DialogDescription>Edite as informações do stage {editingStage.title}.</DialogDescription>
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
                <Label htmlFor="edit-title-stage">Título do stage</Label>
                <Input
                  id="edit-title-stage"
                  value={editStageData.title}
                  onChange={(e) => setEditStageData({ ...editStageData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description-stage">Descrição</Label>
                <Textarea
                  id="edit-description-stage"
                  value={editStageData.description}
                  onChange={(e) => setEditStageData({ ...editStageData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="edit-tempo-stage">Tempo estimado</Label>
                  <Input
                    id="edit-tempo-stage"
                    value={editStageData.tempo_estimado}
                    onChange={(e) => setEditStageData({ ...editStageData, tempo_estimado: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="edit-image-stage">URL da imagem</Label>
                  <Input
                    id="edit-image-stage"
                    value={editStageData.image}
                    onChange={(e) => setEditStageData({ ...editStageData, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="edit-video-stage">URL do vídeo</Label>
                  <Input
                    id="edit-video-stage"
                    value={editStageData.video}
                    onChange={(e) => setEditStageData({ ...editStageData, video: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pontos" className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="edit-ponto-chave">Adicionar ponto-chave</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-ponto-chave"
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
                {editStageData.pontos_chave && editStageData.pontos_chave.length > 0 ? (
                  editStageData.pontos_chave.map((ponto, index) => (
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
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStage} disabled={isUpdatingStage || !editStageData.title?.trim()}>
              {isUpdatingStage ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
