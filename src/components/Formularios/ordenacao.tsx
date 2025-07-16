"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoveUp, MoveDown, X } from "lucide-react"
import type { QuestionOption } from "@/types/painel"

interface OrderingFormProps {
  items: QuestionOption[]
  correctOrder: string[]
  statementText: string
  onItemsChange: (items: QuestionOption[]) => void
  onCorrectOrderChange: (correctOrder: string[]) => void
  onStatementTextChange: (statementText: string) => void
}

export function OrderingForm({
  items,
  correctOrder,
  statementText,
  onItemsChange,
  onCorrectOrderChange,
  onStatementTextChange,
}: OrderingFormProps) {
  const [newItem, setNewItem] = useState<QuestionOption>({ id: "", text: "", imageUrl: "" })
  const [showItemImage, setShowItemImage] = useState(false)

  function handleAddItem() {
    // Only proceed if we have either text or an image URL (when image is enabled)
    if (!newItem.text.trim() && (!showItemImage || !newItem.imageUrl?.trim())) {
      return
    }

    // Create a new item with a unique ID
    const newId = `item_${Date.now()}`
    const item = {
      id: newId,
      text: newItem.text.trim(),
      imageUrl: showItemImage ? newItem.imageUrl?.trim() || "" : "",
    }

    // Create new arrays instead of modifying existing ones
    const updatedItems = Array.isArray(items) ? [...items, item] : [item]
    const updatedOrder = Array.isArray(correctOrder) ? [...correctOrder, newId] : [newId]

    // Call the callback functions to update the parent state
    onItemsChange(updatedItems)
    onCorrectOrderChange(updatedOrder)

    // Reset the form fields
    setNewItem({ id: "", text: "", imageUrl: "" })
    setShowItemImage(false)

    // Log for debugging
    console.log("New item added:", item)
    console.log("Updated items:", updatedItems)
    console.log("Updated order:", updatedOrder)
  }

  function handleRemoveItem(itemId: string) {
    onItemsChange(items.filter((item) => item.id !== itemId))
    onCorrectOrderChange(correctOrder.filter((id) => id !== itemId))
  }

  function handleMoveItem(itemId: string, direction: "up" | "down") {
    const currentIndex = correctOrder.indexOf(itemId)

    if (currentIndex === -1) return

    const newOrder = [...correctOrder]

    if (direction === "up" && currentIndex > 0) {
      // Mover para cima
      ;[newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]]
    } else if (direction === "down" && currentIndex < newOrder.length - 1) {
      // Mover para baixo
      ;[newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]]
    }

    onCorrectOrderChange(newOrder)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="statement-text">Enunciado da questão</Label>
        <Input
          id="statement-text"
          placeholder="Ex: Coloque os eventos na ordem cronológica correta"
          value={statementText}
          onChange={(e) => onStatementTextChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Itens para ordenar</Label>
        {items && items.length > 0 ? (
          <div className="space-y-2">
            {correctOrder.map((itemId, index) => {
              const item = items.find((i) => i.id === itemId)
              if (!item) return null

              return (
                <div key={item.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.text}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span>{item.text}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveItem(item.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveItem(item.id, "down")}
                      disabled={index === correctOrder.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
        )}

        <div className="space-y-2">
          <Input
            placeholder="Digite um item para ordenar"
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && !showItemImage && handleAddItem()}
          />

          <div className="flex items-center space-x-2">
            <Switch id="show-item-image" checked={showItemImage} onCheckedChange={setShowItemImage} />
            <Label htmlFor="show-item-image">Adicionar imagem</Label>
          </div>

          {showItemImage && (
            <Input
              placeholder="URL da imagem"
              value={newItem.imageUrl || ""}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            />
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => {
              console.log("Add button clicked")
              console.log("Current newItem:", newItem)
              console.log("showItemImage:", showItemImage)
              handleAddItem()
            }}
            disabled={!newItem.text.trim() && (!showItemImage || !newItem.imageUrl?.trim())}
            className="w-full"
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
