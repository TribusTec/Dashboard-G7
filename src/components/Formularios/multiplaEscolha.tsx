"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface QuestionOption {
  id: string
  text: string
  imageUrl?: string
}

interface MultipleChoiceFormProps {
  options: QuestionOption[]
  correctOptions: string[]
  multipleCorrect: boolean
  statementText: string
  onOptionsChange: (options: QuestionOption[]) => void
  onCorrectOptionsChange: (correctOptions: string[]) => void
  onMultipleCorrectChange: (multipleCorrect: boolean) => void
  onStatementTextChange: (statementText: string) => void
}

export function MultipleChoiceForm({
  options,
  correctOptions,
  multipleCorrect,
  statementText,
  onOptionsChange,
  onCorrectOptionsChange,
  onMultipleCorrectChange,
  onStatementTextChange,
}: MultipleChoiceFormProps) {
  const [newOptionText, setNewOptionText] = useState("")
  const [newOptionImage, setNewOptionImage] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  // Função para gerar próximo ID sequencial
  const getNextId = () => {
    if (options.length === 0) return "1"
    
    // Encontrar o maior ID numérico atual
    const numericIds = options
      .map(opt => parseInt(opt.id))
      .filter(id => !isNaN(id))
    
    if (numericIds.length === 0) return "1"
    
    const maxId = Math.max(...numericIds)
    return String(maxId + 1)
  }

  // Função para reordenar IDs sequencialmente
  const reorderIds = (optionsList: QuestionOption[]) => {
    return optionsList.map((option, index) => ({
      ...option,
      id: String(index + 1)
    }))
  }

  function handleAddOption() {
    if (!newOptionText.trim() && !newOptionImage.trim()) return
    
    const newOption: QuestionOption = {
      id: getNextId(),
      text: newOptionText.trim(),
      imageUrl: showImageInput ? newOptionImage.trim() : undefined,
    }
    
   
    const updatedOptions = [...options, newOption]

    
    onOptionsChange(updatedOptions)
    setNewOptionText("")
    setNewOptionImage("")
    setShowImageInput(false)
  }

  function handleRemoveOption(optionId: string) {
  
    
   
    const filteredOptions = options.filter((opt) => {
      const shouldKeep = opt.id !== optionId
      return shouldKeep
    })
    

    const reorderedOptions = reorderIds(filteredOptions)
    

    const oldToNewIdMap = new Map<string, string>()
    filteredOptions.forEach((oldOption, index) => {
      oldToNewIdMap.set(oldOption.id, String(index + 1))
    })
    
    const updatedCorrectOptions = correctOptions
      .filter(id => id !== optionId) 
      .map(oldId => oldToNewIdMap.get(oldId) || oldId) 
      .filter(id => id) 
    

    
   
    onOptionsChange(reorderedOptions)
    onCorrectOptionsChange(updatedCorrectOptions)
    

  }

  function handleToggleCorrectOption(optionId: string) {
   
    if (multipleCorrect) {
      if (correctOptions.includes(optionId)) {
        onCorrectOptionsChange(correctOptions.filter((id) => id !== optionId))
      } else {
        onCorrectOptionsChange([...correctOptions, optionId])
      }
    } else {
      onCorrectOptionsChange([optionId])
    }
  }

  function handleOptionTextChange(id: string, text: string) {

    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, text } : option
    )
    onOptionsChange(updatedOptions)
  }

  return (
    <div className="space-y-6">
      {/* Enunciado */}
      <div>
        <Label htmlFor="statement">Enunciado da questão</Label>
        <Input
          id="statement"
          placeholder="Digite o enunciado da questão"
          value={statementText}
          onChange={(e) => onStatementTextChange(e.target.value)}
        />
      </div>

      {/* Switch múltiplas corretas */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-md p-3">
        <Switch
          id="multiple-correct"
          checked={multipleCorrect}
          onCheckedChange={onMultipleCorrectChange}
        />
        <Label htmlFor="multiple-correct">
          {multipleCorrect ? "Múltiplas respostas corretas" : "Apenas uma resposta correta"}
        </Label>
      </div>

      {/* Lista de opções */}
      <div className="space-y-3">
        <Label>Opções ({options.length})</Label>
        {options.length > 0 ? (
          options.map((option, index) => (
            <div
              key={`option-${option.id}-${index}`} // Key única para forçar re-render
              className="flex items-center justify-between bg-muted p-2 rounded-md"
            >
              <div className="flex items-center gap-2 w-full">
                <Switch
                  checked={correctOptions.includes(option.id)}
                  onCheckedChange={() => handleToggleCorrectOption(option.id)}
                />
                {option.imageUrl && (
                  <img src={option.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                )}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-gray-600 min-w-[20px]">
                    {option.id}.
                  </span>
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    className="flex-1"
                    placeholder={`Opção ${option.id}`}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                 
                  
                  handleRemoveOption(option.id)
                }}
                type="button"
                className="ml-2 hover:bg-red-100"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma opção adicionada.</p>
        )}
      </div>


      <div className="space-y-2">
        <Input
          placeholder="Digite uma nova opção"
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddOption()
            }
          }}
        />

        <div className="flex items-center gap-2">
          <Switch
            id="add-image"
            checked={showImageInput}
            onCheckedChange={setShowImageInput}
          />
          <Label htmlFor="add-image">Adicionar imagem</Label>
        </div>

        {showImageInput && (
          <Input
            placeholder="URL da imagem"
            value={newOptionImage}
            onChange={(e) => setNewOptionImage(e.target.value)}
          />
        )}

        <Button
          type="button"
          onClick={handleAddOption}
          disabled={!newOptionText.trim() && (!showImageInput || !newOptionImage.trim())}
          className="w-full"
        >
          Adicionar Opção
        </Button>
      </div>
    </div>
  )
}
