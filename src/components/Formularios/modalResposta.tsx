"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ExplanationFormProps {
  title: string
  description: string
  imageUrl?: string
  showImage: boolean
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onImageUrlChange: (imageUrl: string) => void
  onShowImageChange: (showImage: boolean) => void
  isCorrect: boolean
}

export function ExplanationForm({
  title,
  description,
  imageUrl,
  showImage,
  onTitleChange,
  onDescriptionChange,
  onImageUrlChange,
  onShowImageChange,
  isCorrect,
}: ExplanationFormProps) {
  const labelId = isCorrect ? "correct" : "incorrect"

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h3 className="font-medium text-lg">Explicação da Resposta {isCorrect ? "Correta" : "Incorreta"}</h3>
      <div className="space-y-2">
        <Label htmlFor={`${labelId}-explanation-title`}>Título</Label>
        <Input
          id={`${labelId}-explanation-title`}
          placeholder={`Ex: Resposta ${isCorrect ? "Correta" : "Incorreta"}!`}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${labelId}-explanation-description`}>Descrição</Label>
        <Textarea
          id={`${labelId}-explanation-description`}
          placeholder={`Ex: ${isCorrect ? "Parabéns! Você acertou porque..." : "Você errou porque..."}`}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id={`show-${labelId}-explanation-image`} checked={showImage} onCheckedChange={onShowImageChange} />
          <Label htmlFor={`show-${labelId}-explanation-image`}>Adicionar imagem</Label>
        </div>
        {showImage && (
          <Input
            placeholder={`URL da imagem para resposta ${isCorrect ? "correta" : "incorreta"}`}
            value={imageUrl || ""}
            onChange={(e) => onImageUrlChange(e.target.value)}
          />
        )}
      </div>
    </div>
  )
}
