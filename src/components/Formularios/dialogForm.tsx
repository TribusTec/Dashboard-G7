"use client"


import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { TrueFalseForm } from "./verdadeiroFalso"
import { MultipleChoiceForm } from "./multiplaEscolha"
import { OrderingForm } from "./ordenacao"
import { MatchingForm } from "./correspondencia"
import { ExplanationForm } from "./modalResposta"
import { QuestionType } from "@/types/painel"
import type { Question } from "@/types/painel"

interface QuestionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (question: Partial<Question>) => Promise<void>
  isSubmitting: boolean
  initialQuestion?: Question | null
  isEditing?: boolean
  title: string
  description: string
  submitLabel: string
}

const QUESTION_TYPES = [
  { value: QuestionType.trueOrFalse, label: "Verdadeiro ou Falso" },
  { value: QuestionType.multipleChoice, label: "Múltipla Escolha" },
  { value: QuestionType.ORDERING, label: "Ordenação" },
  { value: QuestionType.MATCHING, label: "Correspondência" },
]

export function QuestionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialQuestion,
  isEditing = false,
  title,
  description,
  submitLabel,
}: QuestionFormDialogProps) {
  const [question, setQuestion] = useState<Partial<Question>>({})
  const [showCorrectExplanationImage, setShowCorrectExplanationImage] = useState(false)
  const [showIncorrectExplanationImage, setShowIncorrectExplanationImage] = useState(false)
  const [showDescriptionImage, setShowDescriptionImage] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)


  const getDefaultQuestion = (): Partial<Question> => ({
    type: QuestionType.trueOrFalse,
    description: "",
    descriptionImageUrl: "",
    isTrue: false,
    options: [],
    correctOptions: [],
    multipleCorrect: false,
    items: [],
    correctOrder: [],
    statementText: "",
    leftColumn: [],
    rightColumn: [],
    correctMatches: [],
    correctExplanation: {
      title: "",
      description: "",
      imageUrl: "",
    },
    incorrectExplanation: {
      title: "",
      description: "",
      imageUrl: "",
    },
  })

  const handleOptionsChange = useCallback((options: any[]) => {

    setQuestion(prevQuestion => {
      const newQuestion = { ...prevQuestion, options }

      return newQuestion
    })
  }, [])

  const handleCorrectOptionsChange = useCallback((correctOptions: string[]) => {
  
    setQuestion(prevQuestion => {
      const newQuestion = { ...prevQuestion, correctOptions }
    
      return newQuestion
    })
  }, [])

  const handleMultipleCorrectChange = useCallback((multipleCorrect: boolean) => {
  
    setQuestion(prevQuestion => ({ ...prevQuestion, multipleCorrect }))
  }, [])

  const handleStatementTextChange = useCallback((statementText: string) => {

    setQuestion(prevQuestion => ({ ...prevQuestion, statementText }))
  }, [])


  useEffect(() => {
    if (open) {
 


      if (isEditing && initialQuestion) {
     





        const questionData = {
          id: initialQuestion.id,

          type: initialQuestion.type,
          description: initialQuestion.description || "",
          descriptionImageUrl: initialQuestion.descriptionImageUrl || "",
          explanation: initialQuestion.explanation || "",
          isTrue: initialQuestion.isTrue,
          statementText: initialQuestion.statementText || "",

          options: Array.isArray(initialQuestion.options) ? [...initialQuestion.options] : [],
          correctOptions: Array.isArray(initialQuestion.correctOptions) ? [...initialQuestion.correctOptions] : [],
          items: Array.isArray(initialQuestion.items) ? [...initialQuestion.items] : [],
          correctOrder: Array.isArray(initialQuestion.correctOrder) ? [...initialQuestion.correctOrder] : [],
          leftColumn: Array.isArray(initialQuestion.leftColumn) ? [...initialQuestion.leftColumn] : [],
          rightColumn: Array.isArray(initialQuestion.rightColumn) ? [...initialQuestion.rightColumn] : [],
          correctMatches: Array.isArray(initialQuestion.correctMatches) ? [...initialQuestion.correctMatches] : [],
          multipleCorrect: initialQuestion.multipleCorrect || false,
          correctExplanation: initialQuestion.correctExplanation
            ? {
                title: initialQuestion.correctExplanation.title || "",
                description: initialQuestion.correctExplanation.description || "",
                imageUrl: initialQuestion.correctExplanation.imageUrl || "",
              }
            : {
                title: "",
                description: "",
                imageUrl: "",
              },
          incorrectExplanation: initialQuestion.incorrectExplanation
            ? {
                title: initialQuestion.incorrectExplanation.title || "",
                description: initialQuestion.incorrectExplanation.description || "",
                imageUrl: initialQuestion.incorrectExplanation.imageUrl || "",
              }
            : {
                title: "",
                description: "",
                imageUrl: "",
              },
        }

        setQuestion(questionData)
        setShowCorrectExplanationImage(!!initialQuestion.correctExplanation?.imageUrl)
        setShowIncorrectExplanationImage(!!initialQuestion.incorrectExplanation?.imageUrl)
        setShowDescriptionImage(!!initialQuestion.descriptionImageUrl)
      } else {


        const defaultQuestion = getDefaultQuestion()
  
        setQuestion(defaultQuestion)
        setShowCorrectExplanationImage(false)
        setShowIncorrectExplanationImage(false)
        setShowDescriptionImage(false)
      }

      setIsInitialized(true)
    }

  }, [open, isEditing, initialQuestion?.id, initialQuestion?.type])

 
  useEffect(() => {
    if (!open) {
    
      setIsInitialized(false)
      setQuestion({})
      setShowCorrectExplanationImage(false)
      setShowIncorrectExplanationImage(false)
      setShowDescriptionImage(false)
    }
  }, [open])


  useEffect(() => {
    
  }, [question.options, question.correctOptions])

  const handleSubmit = async () => {



    const questionToSubmit = {
      ...question,
      type: question.type,
      descriptionImageUrl: showDescriptionImage ? question.descriptionImageUrl || "" : "",
    }

    await onSubmit(questionToSubmit)
  }

  const isQuestionValid = () => {
    const hasDescription = question.description?.trim()
    const hasDescriptionImage = showDescriptionImage && question.descriptionImageUrl?.trim()
    return hasDescription || hasDescriptionImage
  }



  const renderQuestionTypeForm = () => {


    switch (question.type) {
      case QuestionType.trueOrFalse:
        return (
          <TrueFalseForm
            isTrue={question.isTrue || false}


            onChange={(isTrue: any) => setQuestion(prev => ({ ...prev, isTrue }))}
            onStatementTextChange={handleStatementTextChange}
            statementText={question.statementText || ""}
          />
        )
      case QuestionType.multipleChoice:
        return (
          <MultipleChoiceForm
            options={question.options || []}
            correctOptions={question.correctOptions || []}
            multipleCorrect={question.multipleCorrect || false}




            statementText={question.statementText || ""}
            onOptionsChange={handleOptionsChange}
            onCorrectOptionsChange={handleCorrectOptionsChange}
            onMultipleCorrectChange={handleMultipleCorrectChange}
            onStatementTextChange={handleStatementTextChange}
          />
        )
      case QuestionType.ORDERING:
        return (
          <OrderingForm
            items={question.items || []}
            correctOrder={question.correctOrder || []}
            statementText={question.statementText || ""}
            onItemsChange={(items) => {
             
              setQuestion((prevQuestion) => ({
                ...prevQuestion,
                items: items,
              }))
            }}
            onCorrectOrderChange={(correctOrder) => {
   
              setQuestion((prevQuestion) => ({
                ...prevQuestion,
                correctOrder: correctOrder,
              }))
            }}






            onStatementTextChange={handleStatementTextChange}
          />
        )
      case QuestionType.MATCHING:
        return (
          <MatchingForm
            leftColumn={question.leftColumn || []}
            rightColumn={question.rightColumn || []}
            correctMatches={question.correctMatches || []}
            statementText={question.statementText || ""}
            onLeftColumnChange={(leftColumn) => {
        

              setQuestion(prev => ({ ...prev, leftColumn }))
            }}
            onRightColumnChange={(rightColumn) => {
              console.log("📝 Coluna direita atualizada:", rightColumn)

              setQuestion(prev => ({ ...prev, rightColumn }))
            }}
            onCorrectMatchesChange={(correctMatches) => {
              console.log("📝 Correspondências atualizadas:", correctMatches)

              setQuestion(prev => ({ ...prev, correctMatches }))
            }}

            onStatementTextChange={handleStatementTextChange}
          />
        )
      default:
        console.warn("⚠️ Tipo de questão não reconhecido:", question.type)
        return null
    }
  }



  if (open && !isInitialized) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-type">Tipo de Questão</Label>
            <Select
              value={question.type || QuestionType.trueOrFalse}
              onValueChange={(value) => {
              


                if (isEditing) {
                  return
                }


                setQuestion(prev => ({ ...prev, type: value as QuestionType }))
              }}

              disabled={isEditing}
            >
              <SelectTrigger id="question-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="question-description">Descrição da questão (opcional)</Label>

            <Textarea
              id="question-description"
              placeholder="Ex: React Native permite escrever código uma vez e executar em múltiplas plataformas."
              value={question.description || ""}

              onChange={(e) => setQuestion(prev => ({ ...prev, description: e.target.value }))}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-description-image"
                checked={showDescriptionImage}
                onCheckedChange={(checked) => {
                  setShowDescriptionImage(checked as boolean)
                  if (!checked) {
                    setQuestion({ ...question, descriptionImageUrl: "" })
                  }
                }}
              />
              <Label htmlFor="show-description-image" className="text-sm">
                Adicionar imagem à descrição
              </Label>
            </div>

            {showDescriptionImage && (
              <div className="space-y-2">
                <Label htmlFor="description-image-url">URL da Imagem da Descrição</Label>
                <Input
                  id="description-image-url"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={question.descriptionImageUrl || ""}
                  onChange={(e) => setQuestion({ ...question, descriptionImageUrl: e.target.value })}
                />
                {question.descriptionImageUrl && (
                  <div className="mt-2">
                    <Label className="text-sm text-gray-600">Preview da imagem:</Label>
                    <div className="mt-1 border rounded-md p-2">
                      <img
                        src={question.descriptionImageUrl || "/placeholder.svg"}
                        alt="Preview da descrição"
                        className="max-w-full h-auto max-h-48 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {renderQuestionTypeForm()}

          <ExplanationForm
            title={question.correctExplanation?.title || ""}
            description={question.correctExplanation?.description || ""}
            imageUrl={question.correctExplanation?.imageUrl}
            showImage={showCorrectExplanationImage}
            onTitleChange={(title) =>
              setQuestion({
                ...question,
                correctExplanation: {
                  ...question.correctExplanation!,
                  title,
                },
              })
            }
            onDescriptionChange={(description) =>
              setQuestion({
                ...question,
                correctExplanation: {
                  ...question.correctExplanation!,
                  description,
                },
              })
            }
            onImageUrlChange={(imageUrl) =>
              setQuestion({
                ...question,
                correctExplanation: {
                  ...question.correctExplanation!,
                  imageUrl,
                },
              })
            }
            onShowImageChange={setShowCorrectExplanationImage}
            isCorrect={true}
          />

          <ExplanationForm
            title={question.incorrectExplanation?.title || ""}
            description={question.incorrectExplanation?.description || ""}
            imageUrl={question.incorrectExplanation?.imageUrl}
            showImage={showIncorrectExplanationImage}
            onTitleChange={(title) =>
              setQuestion({
                ...question,
                incorrectExplanation: {
                  ...question.incorrectExplanation!,
                  title,
                },
              })
            }
            onDescriptionChange={(description) =>
              setQuestion({
                ...question,
                incorrectExplanation: {
                  ...question.incorrectExplanation!,
                  description,
                },
              })
            }
            onImageUrlChange={(imageUrl) =>
              setQuestion({
                ...question,
                incorrectExplanation: {
                  ...question.incorrectExplanation!,
                  imageUrl,
                },
              })
            }
            onShowImageChange={setShowIncorrectExplanationImage}
            isCorrect={false}
          />

          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isQuestionValid()}
              className={isEditing ? "" : "w-full"}
            >
              {isSubmitting ? "Processando..." : submitLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
