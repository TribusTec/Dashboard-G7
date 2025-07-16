"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QuestionOption, MatchingPair } from "@/types/painel"

interface MatchingFormProps {
  leftColumn: QuestionOption[]
  rightColumn: QuestionOption[]
  correctMatches: MatchingPair[]
  statementText: string
  onLeftColumnChange: (leftColumn: QuestionOption[]) => void
  onRightColumnChange: (rightColumn: QuestionOption[]) => void
  onCorrectMatchesChange: (correctMatches: MatchingPair[]) => void
  onStatementTextChange: (statementText: string) => void
}

export function MatchingForm({
  leftColumn,
  rightColumn,
  correctMatches,
  statementText,
  onLeftColumnChange,
  onRightColumnChange,
  onCorrectMatchesChange,
  onStatementTextChange,
}: MatchingFormProps) {
  const [newLeftItem, setNewLeftItem] = useState<QuestionOption>({ id: "", text: "", imageUrl: "" })
  const [newRightItem, setNewRightItem] = useState<QuestionOption>({ id: "", text: "", imageUrl: "" })
  const [showLeftImageInput, setShowLeftImageInput] = useState(false)
  const [showRightImageInput, setShowRightImageInput] = useState(false)
  const [newMatch, setNewMatch] = useState<MatchingPair>({ left: "", right: "" })


  const getNextLeftId = () => {
    if (leftColumn.length === 0) return "L1"
    
    const numericIds = leftColumn
      .map(item => parseInt(item.id.replace('L', '')))
      .filter(id => !isNaN(id))
    
    if (numericIds.length === 0) return "L1"
    
    const maxId = Math.max(...numericIds)
    return `L${maxId + 1}`
  }


  const getNextRightId = () => {
    if (rightColumn.length === 0) return "R1"
    
    const numericIds = rightColumn
      .map(item => parseInt(item.id.replace('R', '')))
      .filter(id => !isNaN(id))
    
    if (numericIds.length === 0) return "R1"
    
    const maxId = Math.max(...numericIds)
    return `R${maxId + 1}`
  }


  const reorderLeftIds = (items: QuestionOption[]) => {
    return items.map((item, index) => ({
      ...item,
      id: `L${index + 1}`
    }))
  }


  const reorderRightIds = (items: QuestionOption[]) => {
    return items.map((item, index) => ({
      ...item,
      id: `R${index + 1}`
    }))
  }

  function handleAddLeftItem() {
    if (!newLeftItem.text.trim() && !newLeftItem.imageUrl) return

    const item = {
      id: getNextLeftId(),
      text: newLeftItem.text.trim(),
      imageUrl: showLeftImageInput ? newLeftItem.imageUrl || "" : "",
    }

  
    const updatedLeftColumn = [...leftColumn, item]
    onLeftColumnChange(updatedLeftColumn)
    setNewLeftItem({ id: "", text: "", imageUrl: "" })
    setShowLeftImageInput(false)
  }

  function handleAddRightItem() {
    if (!newRightItem.text.trim() && !newRightItem.imageUrl) return

    const item = {
      id: getNextRightId(),
      text: newRightItem.text.trim(),
      imageUrl: showRightImageInput ? newRightItem.imageUrl || "" : "",
    }

    const updatedRightColumn = [...rightColumn, item]
    onRightColumnChange(updatedRightColumn)
    setNewRightItem({ id: "", text: "", imageUrl: "" })
    setShowRightImageInput(false)
  }

  function handleAddMatch() {
    if (!newMatch.left || !newMatch.right) return


    onCorrectMatchesChange([...correctMatches, { left: newMatch.left, right: newMatch.right }])
    setNewMatch({ left: "", right: "" })
  }

  function handleRemoveMatch(leftId: string, rightId: string) {
  
    
    onCorrectMatchesChange(correctMatches.filter((match) => !(match.left === leftId && match.right === rightId)))
  }

  function handleRemoveLeftItem(itemId: string) {
    


    const filteredItems = leftColumn.filter((item) => {
      const shouldKeep = item.id !== itemId
  
      return shouldKeep
    })

    const reorderedItems = reorderLeftIds(filteredItems)


    const oldToNewIdMap = new Map<string, string>()
    filteredItems.forEach((oldItem, index) => {
      oldToNewIdMap.set(oldItem.id, `L${index + 1}`)
    })

   
    const updatedMatches = correctMatches
      .filter(match => match.left !== itemId) 
      .map(match => ({
        ...match,
        left: oldToNewIdMap.get(match.left) || match.left 
      }))
      .filter(match => match.left && match.right) 



    onLeftColumnChange(reorderedItems)
    onCorrectMatchesChange(updatedMatches)

    
  }

  function handleRemoveRightItem(itemId: string) {



    const filteredItems = rightColumn.filter((item) => {
      const shouldKeep = item.id !== itemId
  
      return shouldKeep
    })


    const reorderedItems = reorderRightIds(filteredItems)


    const oldToNewIdMap = new Map<string, string>()
    filteredItems.forEach((oldItem, index) => {
      oldToNewIdMap.set(oldItem.id, `R${index + 1}`)
    })

    const updatedMatches = correctMatches
      .filter(match => match.right !== itemId) 
      .map(match => ({
        ...match,
        right: oldToNewIdMap.get(match.right) || match.right 
      }))
      .filter(match => match.left && match.right) 



    onRightColumnChange(reorderedItems)
    onCorrectMatchesChange(updatedMatches)

    
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="statement-text">Enunciado da questão</Label>
        <Input
          id="statement-text"
          placeholder="Ex: Relacione os conceitos com suas definições"
          value={statementText}
          onChange={(e) => onStatementTextChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Coluna Esquerda ({leftColumn.length})</Label>
          {leftColumn && leftColumn.length > 0 ? (
            <div className="space-y-2">
              {leftColumn.map((item, index) => (
                <div key={`left-${item.id}-${index}`} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600 min-w-[30px]">
                      {item.id}
                    </span>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.text}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="flex-1">{item.text}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      handleRemoveLeftItem(item.id)
                    }}
                    type="button"
                    className="hover:bg-red-100"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Item da coluna esquerda"
              value={newLeftItem.text}
              onChange={(e) => setNewLeftItem({ ...newLeftItem, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showLeftImageInput) {
                  e.preventDefault()
                  handleAddLeftItem()
                }
              }}
            />

            <div className="flex items-center space-x-2">
              <Switch id="show-left-image" checked={showLeftImageInput} onCheckedChange={setShowLeftImageInput} />
              <Label htmlFor="show-left-image">Adicionar imagem</Label>
            </div>

            {showLeftImageInput && (
              <Input
                placeholder="URL da imagem"
                value={newLeftItem.imageUrl || ""}
                onChange={(e) => setNewLeftItem({ ...newLeftItem, imageUrl: e.target.value })}
              />
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleAddLeftItem}
              disabled={!newLeftItem.text.trim() && (!showLeftImageInput || !newLeftItem.imageUrl)}
              className="w-full"
            >
              Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Coluna Direita ({rightColumn.length})</Label>
          {rightColumn && rightColumn.length > 0 ? (
            <div className="space-y-2">
              {rightColumn.map((item, index) => (
                <div key={`right-${item.id}-${index}`} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600 min-w-[30px]">
                      {item.id}
                    </span>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.text}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="flex-1">{item.text}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                     
                      handleRemoveRightItem(item.id)
                    }}
                    type="button"
                    className="hover:bg-red-100"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Item da coluna direita"
              value={newRightItem.text}
              onChange={(e) => setNewRightItem({ ...newRightItem, text: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && !showRightImageInput && handleAddRightItem()}
            />

            <div className="flex items-center space-x-2">
              <Switch id="show-right-image" checked={showRightImageInput} onCheckedChange={setShowRightImageInput} />
              <Label htmlFor="show-right-image">Adicionar imagem</Label>
            </div>

            {showRightImageInput && (
              <Input
                placeholder="URL da imagem"
                value={newRightItem.imageUrl || ""}
                onChange={(e) => setNewRightItem({ ...newRightItem, imageUrl: e.target.value })}
              />
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleAddRightItem}
              disabled={!newRightItem.text.trim() && (!showRightImageInput || !newRightItem.imageUrl)}
              className="w-full"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label>Correspondências Corretas</Label>
        {correctMatches && correctMatches.length > 0 ? (
          <div className="space-y-2">
            {correctMatches.map((match, index) => {
              const leftItem = leftColumn?.find((i) => i.id === match.left)
              const rightItem = rightColumn?.find((i) => i.id === match.right)

              if (!leftItem || !rightItem) return null

              return (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {leftItem.imageUrl && (
                        <img
                          src={leftItem.imageUrl || "/placeholder.svg"}
                          alt={leftItem.text}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="font-medium">{leftItem.text}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      {rightItem.imageUrl && (
                        <img
                          src={rightItem.imageUrl || "/placeholder.svg"}
                          alt={rightItem.text}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span>{rightItem.text}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveMatch(match.left, match.right)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma correspondência definida.</p>
        )}

        {leftColumn?.length && rightColumn?.length ? (
          <div className="flex gap-2 mt-2">
            <Select value={newMatch.left} onValueChange={(value) => setNewMatch({ ...newMatch, left: value })}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Item da esquerda" />
              </SelectTrigger>
              <SelectContent>
                {leftColumn.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newMatch.right} onValueChange={(value) => setNewMatch({ ...newMatch, right: value })}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Item da direita" />
              </SelectTrigger>
              <SelectContent>
                {rightColumn.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="button" size="sm" onClick={handleAddMatch} disabled={!newMatch.left || !newMatch.right}>
              Adicionar
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Adicione itens em ambas as colunas para criar correspondências.
          </p>
        )}
      </div>
    </div>
  )
}
