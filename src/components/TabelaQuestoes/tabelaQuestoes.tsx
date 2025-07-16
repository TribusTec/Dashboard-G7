"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/ModalConfirm"
import { HelpCircle, Pencil, Trash2 } from "lucide-react"
import { QuestionType } from "@/types/painel"
import type { Question } from "@/types/painel"
import { fixQuestionType } from "@/utils/debug"

interface QuestionTableProps {
  questions: Question[]
  onEditQuestion: (question: Question) => void
  onDeleteQuestion: (questionId: string) => void
}

export function QuestionTable({ questions, onEditQuestion, onDeleteQuestion }: QuestionTableProps) {
  // Corrigir os tipos das questões antes de exibir
  const correctedQuestions = questions.map(fixQuestionType)

  function getQuestionTypeLabel(type: string): string {
    const QUESTION_TYPES = [
      { value: QuestionType.trueOrFalse, label: "Verdadeiro ou Falso" },
      { value: QuestionType.multipleChoice, label: "Múltipla Escolha" },
      { value: QuestionType.ORDERING, label: "Ordenação" },
      { value: QuestionType.MATCHING, label: "Correspondência" },
    ]
    return QUESTION_TYPES.find((t) => t.value === type)?.label || type
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questões do Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {correctedQuestions && correctedQuestions.length > 0 ? (
              correctedQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Badge>{getQuestionTypeLabel(question.type)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{question.description}</TableCell>
                  <TableCell>
                    {question.type === QuestionType.trueOrFalse && (
                      <Badge variant={question.isTrue ? "secondary" : "destructive"}>
                        {question.isTrue ? "Verdadeiro" : "Falso"}
                      </Badge>
                    )}
                    {question.type === QuestionType.multipleChoice && (
                      <Badge variant="outline">{question.options?.length || 0} opções</Badge>
                    )}
                    {question.type === QuestionType.ORDERING && (
                      <Badge variant="outline">{question.items?.length || 0} itens</Badge>
                    )}
                    {question.type === QuestionType.MATCHING && (
                      <Badge variant="outline">{question.correctMatches?.length || 0} correspondências</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => onEditQuestion(question)}>
                              <Pencil size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar questão</p>
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
                              description="Você tem certeza de que deseja excluir esta questão? Esta ação não pode ser desfeita."
                              onConfirm={() => onDeleteQuestion(question.id)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir questão</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <HelpCircle className="h-8 w-8 text-gray-400" />
                    <p className="text-muted-foreground">Nenhuma questão cadastrada</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
