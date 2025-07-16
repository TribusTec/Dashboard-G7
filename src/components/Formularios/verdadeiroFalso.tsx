"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2, XCircle } from "lucide-react"

interface TrueFalseFormProps {
  isTrue: boolean
  statementText: string
  onChange: (isTrue: boolean) => void
  onStatementTextChange: (statementText: string) => void
}

export function TrueFalseForm({ isTrue, statementText, onChange, onStatementTextChange }: TrueFalseFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="statement-text">Enunciado da questão</Label>
        <Input
          id="statement-text"
          placeholder="Ex: Instruções adicionais para a questão"
          value={statementText}
          onChange={(e) => onStatementTextChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
        <Switch id="question-is-true" checked={isTrue} onCheckedChange={onChange} />
        <Label htmlFor="question-is-true" className="flex items-center gap-2">
          {isTrue ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>A afirmação é verdadeira</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span>A afirmação é falsa</span>
            </>
          )}
        </Label>
      </div>
    </div>
  )
}
