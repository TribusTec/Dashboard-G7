"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { api } from "@/utils/api"
import { useAuth } from "@/context/authContext"
import type { Trilha } from "@/types/painel"
import { ImageSelector } from "@/components/ImageSelector"

interface EditTrilhaDialogProps {
  editingTrilha: Trilha
  onCancel: () => void
  refetch: () => Promise<void>
}

export function EditTrilhaDialog({ editingTrilha, onCancel, refetch }: EditTrilhaDialogProps) {
  const { token } = useAuth()

  const [editNome, setEditNome] = useState<string>(
    editingTrilha.nome !== undefined && editingTrilha.nome !== null ? String(editingTrilha.nome) : "",
  )
  const [editDescricao, setEditDescricao] = useState<string>(
    editingTrilha.descricao !== undefined && editingTrilha.descricao !== null ? String(editingTrilha.descricao) : "",
  )
  const [editBackgroundSvg, setEditBackgroundSvg] = useState<string>(
    typeof editingTrilha.backgroundSvg === "string" ? editingTrilha.backgroundSvg : ""
  )
  const [isEditing, setIsEditing] = useState(false)

  function sanitizeEtapas(etapas: any[]) {
    if (!Array.isArray(etapas)) return []

    return etapas.map((etapa) => {
      const cleanEtapa: any = {
        id: etapa.id,
        titulo: etapa.titulo, // Apenas 'titulo', não 'title'
        descricao: etapa.descricao,
        icon: etapa.icon,
        iconLibrary: etapa.iconLibrary,
      }

      // Remover campos duplicados se existirem
      if (etapa.imageUrl) {
        cleanEtapa.imageUrl = etapa.imageUrl
      }

      if (Array.isArray(etapa.stages)) {
        cleanEtapa.stages = etapa.stages.map((stage: any) => {
          const cleanStage: any = {
            id: stage.id,
            title: stage.title, // Stages usam 'title'
            description: stage.description,
            tempo_estimado: stage.tempo_estimado,
            video: stage.video,
            image: stage.image,
          }

          if (Array.isArray(stage.pontos_chave)) {
            cleanStage.pontos_chave = [...stage.pontos_chave]
          }

          if (Array.isArray(stage.questions)) {
            cleanStage.questions = stage.questions.map((question: any) => {
              // Preservar todos os campos da questão
              const preservedQuestion = { ...question }

              // Remover apenas campos que não devem ser salvos
              delete preservedQuestion.completed
              delete preservedQuestion.isCompleted

              return preservedQuestion
            })
          }

          return cleanStage
        })
      }

      return cleanEtapa
    })
  }

  function logErrorDetails(error: any) {
    console.error("Detalhes do erro:", error)

    if (error.message && error.message.includes("Dados inválidos")) {
      const match = error.message.match(/"([^"]+)" is not allowed/)
      if (match && match[1]) {
        console.error(`Campo não permitido: ${match[1]}`)
      }
    }
  }

  async function handleUpdateTrail() {
    if (!editNome.trim()) return
    try {
      setIsEditing(true)

      const trilhaAtualizada = {
        id: editingTrilha.id,
        nome: editNome.trim(), // Apenas 'nome', não 'title'
        descricao: typeof editDescricao === "string" ? editDescricao.trim() : "Sem descrição",
        backgroundSvg: typeof editBackgroundSvg === "string" ? editBackgroundSvg.trim() : "",
        etapas: sanitizeEtapas(editingTrilha.etapas || []),
        image: editingTrilha.image || "", // Manter a imagem original
      }

      console.log("Trilha após sanitização:", JSON.stringify(trilhaAtualizada, null, 2))

      console.log("Enviando trilha atualizada:", trilhaAtualizada)

      await api.trails.update(editingTrilha.id, trilhaAtualizada, token || "")

      onCancel()
      toast.success("Trilha atualizada com sucesso!")
      await refetch()
    } catch (err: any) {
      logErrorDetails(err)
      console.error("Erro ao atualizar trilha:", err)
      toast.error("Erro ao atualizar trilha", {
        description: String(err.message || "Ocorreu um erro ao tentar atualizar a trilha."),
      })
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Trilha</DialogTitle>
          <DialogDescription>Edite as informações da trilha {String(editingTrilha.nome)}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-nome-trilha">Nome da trilha</Label>
            <Input id="edit-nome-trilha" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
          </div>
          
          <div>
            <Label htmlFor="edit-descricao-trilha">Descrição</Label>
            <Textarea
              id="edit-descricao-trilha"
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-background-trilha">Imagem de fundo (opcional)</Label>
            <ImageSelector
              selectedImageUrl={editBackgroundSvg}
              onImageSelect={(url) => {
                console.log("Imagem de fundo selecionada:", url)
                setEditBackgroundSvg(url)
              }}
              buttonText="Selecionar Imagem de Fundo"
              placeholder="Nenhuma imagem de fundo selecionada"
            />
         
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTrail} disabled={Boolean(isEditing || !editNome.trim())}>
              {isEditing ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
