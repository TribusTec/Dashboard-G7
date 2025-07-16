import { getAuth } from "firebase/auth"
import type { Trilha } from "@/types/painel"

export async function updateTrilha(trilha: Trilha): Promise<void> {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    const idToken = await user.getIdToken()

    console.log("🔥 === ENVIANDO PARA FIREBASE ===")
    console.log("🔥 Trilha original:", trilha)

    // Log das questões antes da limpeza
    trilha.etapas.forEach((etapa, etapaIndex) => {
      etapa.stages.forEach((stage, stageIndex) => {
        if (stage.questions && stage.questions.length > 0) {
          console.log(`🔥 Etapa ${etapaIndex} - Stage ${stageIndex} - Questões ANTES da limpeza:`)
          stage.questions.forEach((question, questionIndex) => {
            console.log(`  ${questionIndex + 1}. ID: ${question.id}, Tipo: ${question.type}`)
          })
        }
      })
    })

    const trilhaLimpa = removeCompletionData(trilha)

    console.log("🔥 Trilha após limpeza:", trilhaLimpa)

    // Log das questões após a limpeza
    trilhaLimpa.etapas.forEach((etapa: { stages: any[] }, etapaIndex: any) => {
      etapa.stages.forEach((stage: { questions: any[] }, stageIndex: any) => {
        if (stage.questions && stage.questions.length > 0) {
          console.log(`🔥 Etapa ${etapaIndex} - Stage ${stageIndex} - Questões APÓS a limpeza:`)
          stage.questions.forEach((question: { id: any; type: any }, questionIndex: number) => {
            console.log(`  ${questionIndex + 1}. ID: ${question.id}, Tipo: ${question.type}`)
          })
        }
      })
    })

    const dataToSend = JSON.stringify(trilhaLimpa)
    console.log("🔥 JSON que será enviado:", dataToSend)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/trilhas/${trilha.id}.json?auth=${idToken}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataToSend,
      },
    )

    if (!response.ok) {
      throw new Error("Erro ao atualizar trilha: " + response.statusText)
    }

    console.log("🔥 Resposta do Firebase:", await response.text())
    console.log("✅ Trilha atualizada com sucesso no Firebase")
  } catch (error: any) {
    console.error("❌ Erro ao atualizar trilha no Firebase:", error)
    throw new Error("Erro ao atualizar trilha no Firebase: " + error.message)
  }
}

export function removeCompletionData(obj: any): any {
  if (!obj) return obj

  // Se for um array, processar cada item
  if (Array.isArray(obj)) {
    return obj.map((item) => removeCompletionData(item))
  }

  // Se não for um objeto, retornar como está
  if (typeof obj !== "object" || obj === null) {
    return obj
  }

  const newObj = { ...obj }

  // Remover APENAS propriedades relacionadas a conclusão
  delete newObj.concluida
  delete newObj.completed
  delete newObj.isCompleted
  delete newObj.completedAt
  delete newObj.completedBy
  delete newObj.progress

  // IMPORTANTE: NÃO remover propriedades das questões
  // Processar recursivamente apenas objetos aninhados
  Object.keys(newObj).forEach((key) => {
    if (Array.isArray(newObj[key])) {
      newObj[key] = newObj[key].map((item: any) =>
        typeof item === "object" && item !== null ? removeCompletionData(item) : item,
      )
    } else if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = removeCompletionData(newObj[key])
    }
  })

  return newObj
}
