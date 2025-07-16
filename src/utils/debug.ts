import { QuestionType } from "@/types/painel"
import type { Trilha, Question } from "@/types/painel"

export function debugQuestionTypes(trilhas: Trilha[], context: string) {
  console.log(`🔍 DEBUG ${context}:`)

  trilhas.forEach((trilha) => {
    trilha.etapas.forEach((etapa) => {
      etapa.stages.forEach((stage) => {
        if (stage.questions && stage.questions.length > 0) {
          console.log(`📚 Trilha: ${trilha.nome} | Etapa: ${etapa.titulo} | Stage: ${stage.title}`)
          stage.questions.forEach((question, index) => {
            const detectedType = detectQuestionType(question)
            const isCorrect = question.type === detectedType

            console.log(`  ${index + 1}. ID: ${question.id}`)
            console.log(`     Tipo salvo: ${question.type}`)
            console.log(`     Tipo detectado: ${detectedType}`)
            console.log(`     Status: ${isCorrect ? "✅ Correto" : "❌ Incorreto"}`)

            if (!isCorrect) {
              console.log(`     🔧 Correção necessária: ${question.type} → ${detectedType}`)
            }
          })
        }
      })
    })
  })
}

export function detectQuestionType(question: Question): QuestionType {
  console.log("🔍 Detectando tipo da questão:", question.id)
  console.log("🔍 Propriedades da questão:", {
    hasLeftColumn: !!question.leftColumn?.length,
    hasRightColumn: !!question.rightColumn?.length,
    hasCorrectMatches: !!question.correctMatches?.length,
    hasItems: !!question.items?.length,
    hasCorrectOrder: !!question.correctOrder?.length,
    hasOptions: !!question.options?.length,
    hasCorrectOptions: !!question.correctOptions?.length,
    hasIsTrue: question.hasOwnProperty("isTrue"),
    currentType: question.type,
  })

  // Verificar se tem propriedades de matching (mais específico primeiro)
  if (
    question.leftColumn &&
    question.leftColumn.length > 0 &&
    question.rightColumn &&
    question.rightColumn.length > 0 &&
    question.correctMatches &&
    question.correctMatches.length > 0
  ) {
    console.log("✅ Detectado como MATCHING")
    return QuestionType.MATCHING
  }

  // Verificar se tem propriedades de ordering
  if (question.items && question.items.length > 0 && question.correctOrder && question.correctOrder.length > 0) {
    console.log("✅ Detectado como ORDERING")
    return QuestionType.ORDERING
  }

  // Verificar se tem propriedades de multiple choice
  if (
    question.options &&
    question.options.length > 0 &&
    question.correctOptions &&
    question.correctOptions.length > 0
  ) {
    console.log("✅ Detectado como multipleChoice")
    return QuestionType.multipleChoice
  }

  // Verificar se tem propriedades de true/false
  if (question.hasOwnProperty("isTrue")) {
    console.log("✅ Detectado como trueOrFalse")
    return QuestionType.trueOrFalse
  }

  // Se o tipo já está definido e é válido, manter
  if (question.type && Object.values(QuestionType).includes(question.type)) {
    console.log("✅ Mantendo tipo existente:", question.type)
    return question.type
  }

  // Fallback para true/false se não conseguir detectar
  console.log("⚠️ Fallback para trueOrFalse")
  return QuestionType.trueOrFalse
}

export function validateAndFixQuestionTypes(trilhas: Trilha[]): Trilha[] {
  return trilhas.map((trilha) => ({
    ...trilha,
    etapas: trilha.etapas.map((etapa) => ({
      ...etapa,
      stages: etapa.stages.map((stage) => ({
        ...stage,
        questions:
          stage.questions?.map((question) => {
            const detectedType = detectQuestionType(question)

            if (question.type !== detectedType) {
              console.log(`🔧 Corrigindo tipo da questão ${question.id}: ${question.type} → ${detectedType}`)
              return {
                ...question,
                type: detectedType,
              }
            }

            return question
          }) || [],
      })),
    })),
  }))
}

export function validateQuestionBeforeSave(question: Partial<Question>): boolean {
  if (!question.type) {
    console.error("❌ Questão sem tipo definido:", question)
    return false
  }

  const detectedType = detectQuestionType(question as Question)

  if (question.type !== detectedType) {
    console.error(`❌ Tipo inconsistente na questão:`, {
      id: question.id,
      tipoInformado: question.type,
      tipoDetectado: detectedType,
      questao: question,
    })
    return false
  }

  console.log(`✅ Questão validada com sucesso:`, {
    id: question.id,
    tipo: question.type,
  })

  return true
}

export function fixQuestionType(question: Question): Question {
  const detectedType = detectQuestionType(question)

  console.log(`🔧 Verificando questão ${question.id}:`)
  console.log(`🔧 Tipo salvo: ${question.type}`)
  console.log(`🔧 Tipo detectado: ${detectedType}`)

  // Se o tipo detectado é diferente do tipo salvo, corrigir
  if (question.type !== detectedType) {
    console.log(`🔧 Corrigindo tipo da questão ${question.id}: ${question.type} → ${detectedType}`)

    return {
      ...question,
      type: detectedType,
    }
  }

  console.log(`✅ Tipo da questão ${question.id} está correto: ${question.type}`)
  return question
}
