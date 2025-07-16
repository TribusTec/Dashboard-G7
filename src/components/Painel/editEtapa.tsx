"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import type { Trilha, Etapa } from "@/types/painel"
import { AVAILABLE_ICONS } from "./iconRender"
import { getAuth } from "firebase/auth"
import { Switch } from "@/components/ui/switch"
import { ImageSelector } from "@/components/ImageSelector"

interface EditEtapaDialogProps {
  selectedTrilha: Trilha
  editingEtapa: Etapa
  onCancel: () => void
  refetch: () => Promise<void>
  setSelectedTrilha: (trilha: Trilha) => void
}

export function EditEtapaDialog({
  selectedTrilha,
  editingEtapa,
  onCancel,
  refetch,
  setSelectedTrilha,
}: EditEtapaDialogProps) {
  const { token } = useAuth()
  const [editEtapaTitulo, setEditEtapaTitulo] = useState<string>(
    typeof editingEtapa.titulo === "string"
      ? editingEtapa.titulo
      : editingEtapa.titulo !== undefined && editingEtapa.titulo !== null
        ? String(editingEtapa.titulo)
        : "",
  )
  const [editEtapaDescricao, setEditEtapaDescricao] = useState<string>(
    typeof editingEtapa.descricao === "string"
      ? editingEtapa.descricao
      : editingEtapa.descricao !== undefined && editingEtapa.descricao !== null
        ? String(editingEtapa.descricao)
        : "",
  )
  const [editEtapaIcon, setEditEtapaIcon] = useState<string>(editingEtapa.icon || "book-open")
  const [editEtapaImageUrl, setEditEtapaImageUrl] = useState<string>(editingEtapa.imageUrl || "")
  
  // Inicializar useImage baseado na presença de imageUrl
  const [useImage, setUseImage] = useState(
    Boolean(editingEtapa.imageUrl && editingEtapa.imageUrl.trim() !== "")
  )
  const [isEditingEtapa, setIsEditingEtapa] = useState(false)



  async function handleUpdateEtapa() {
    if (
      !selectedTrilha ||
      !editingEtapa ||
      !editEtapaTitulo ||
      typeof editEtapaTitulo !== "string" ||
      !editEtapaTitulo.trim()
    )
      return

    try {
      setIsEditingEtapa(true)

      if (useImage && typeof editEtapaImageUrl === "string" && !editEtapaImageUrl.trim()) {
        toast.error("Por favor, selecione uma imagem da galeria.")
        setIsEditingEtapa(false)
        return
      }

      const etapaAtualizada: Etapa = {
        ...editingEtapa,
        titulo: typeof editEtapaTitulo === "string" ? editEtapaTitulo.trim() : editEtapaTitulo,
        descricao: typeof editEtapaDescricao === "string" ? editEtapaDescricao.trim() : "Sem descrição",
        icon: useImage ? editEtapaImageUrl : editEtapaIcon, 
        iconLibrary: useImage ? "custom" : "lucide",
        imageUrl: useImage ? editEtapaImageUrl : "", 
      }

    

      const trilhaAtualizada = {
        ...selectedTrilha,
        etapas: selectedTrilha.etapas.map((etapa) => (etapa.id === editingEtapa.id ? etapaAtualizada : etapa)),
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
      onCancel()

      toast.success("Etapa atualizada com sucesso!")

    } catch (err: any) {
      console.error("Erro ao atualizar etapa:", err)
      toast.error("Erro ao atualizar etapa", {
        description: err.message || "Não foi possível atualizar a etapa.",
      })
    } finally {
      setIsEditingEtapa(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Etapa</DialogTitle>
          <DialogDescription>Edite as informações da etapa: {editingEtapa.titulo?.toString() || ""}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-titulo-etapa">Título da etapa</Label>
            <Input
              id="edit-titulo-etapa"
              value={editEtapaTitulo}
              onChange={(e) => setEditEtapaTitulo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-descricao-etapa">Descrição</Label>
            <Textarea
              id="edit-descricao-etapa"
              value={editEtapaDescricao}
              onChange={(e) => setEditEtapaDescricao(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="edit-use-image" checked={useImage} onCheckedChange={(checked) => setUseImage(checked)} />
            <Label htmlFor="edit-use-image">Usar imagem em vez de ícone</Label>
          </div>
          {!useImage ? (
            <div className="space-y-2">
              <Label htmlFor="edit-icon-etapa">Ícone</Label>
              <Select value={editEtapaIcon} onValueChange={(value) => setEditEtapaIcon(value)}>
                <SelectTrigger id="edit-icon-etapa">
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
              <Label htmlFor="edit-image-url">Imagem da Etapa</Label>
              <ImageSelector
                selectedImageUrl={editEtapaImageUrl}
                onImageSelect={(url) => {
                  console.log("URL selecionada no ImageSelector:", url) // Debug
                  setEditEtapaImageUrl(url)
                }}
                buttonText="Selecionar Imagem"
                placeholder="Nenhuma imagem selecionada"
              />
          
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateEtapa} disabled={isEditingEtapa || !editEtapaTitulo.trim()}>
              {isEditingEtapa ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
