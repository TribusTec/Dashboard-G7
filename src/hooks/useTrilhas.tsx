"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/utils/api"
import { useAuth } from "@/context/authContext"
import { type Trilha, QuestionType } from "@/types/painel"
import { fixQuestionType } from "@/utils/debug"

const TRILHAS_SIMULADAS: Trilha[] = [
  {
    id: "1",
    
    nome: "React Native Básico",
    descricao: "Aprenda os fundamentos do React Native",
    image: "https://url-para-imagem-rio.svg",
    backgroundSvg: "https://url-para-background1.svg",
    etapas: [
      {
        id: "2",

        titulo: "Componentes Básicos",
        descricao: "Aprenda sobre os componentes fundamentais",
        icon: "book-open-text",
        iconLibrary: "lucide",
        imageUrl: "",
        stages: [
          {
            id: "stage1",
            title: "Introdução aos Componentes",
            description: "Conceitos básicos de componentes React Native",
            image: "https://reactnative.dev/img/tiny_logo.png",
            video: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
            tempo_estimado: "15-20 minutos",
            pontos_chave: [
              "Entender o que são componentes no React Native",
              "Conhecer os componentes básicos da plataforma",
              "Aprender a criar componentes personalizados",
            ],
            questions: [
              {
                id: "q1",
                type: QuestionType.trueOrFalse,
                description: "React Native permite escrever código uma vez e executar em múltiplas plataformas.",
                isTrue: true,
                explanation: "Correto! React Native permite que você escreva código JavaScript que funciona tanto em iOS quanto em Android.",
              },
            ],
            completed: undefined
          },
        ],
        icone: ""
      },
    ],
  },
  {
    id: "2",
    
    nome: "Flutter Básico",
    descricao: "Aprenda os fundamentos do Flutter",
    image: "https://url-para-imagem-flutter.svg",
    backgroundSvg: "",
    etapas: [
      {
        id: "3",

        titulo: "Widgets Básicos",
        descricao: "Aprenda sobre os widgets fundamentais",
        icon: "layout",
        iconLibrary: "lucide",
        imageUrl: "",
        stages: [
          {
            id: "stage1",
            title: "Introdução aos Widgets",
            description: "Conceitos básicos de widgets Flutter",
            tempo_estimado: "15-20 minutos",
            pontos_chave: [
              "Entender o que são widgets no Flutter",
              "Conhecer os widgets básicos da plataforma",
              "Aprender a criar widgets personalizados",
            ],
            questions: [
              {
                id: "q2",
                type: QuestionType.multipleChoice,
                description: "Qual é a linguagem principal usada no Flutter?",
                options: [
                  { id: "opt1", text: "JavaScript" },
                  { id: "opt2", text: "Dart" },
                  { id: "opt3", text: "Java" },
                  { id: "opt4", text: "Swift" },
                ],
                correctOptions: ["opt2"],
                explanation: "Flutter usa Dart como linguagem principal de desenvolvimento.",
              },
            ],
            completed: undefined
          },
        ],
        icone: ""
      },
    ],
  },
]

export function useTrails() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, token } = useAuth()

  const fetchTrilhas = useCallback(async () => {

    setIsLoading(true)
    setError(null)


    const modoSimulado = localStorage.getItem("modo_simulado") === "true"

    if (modoSimulado) {

      await new Promise((resolve) => setTimeout(resolve, 800))
      setTrilhas(TRILHAS_SIMULADAS)
      setIsLoading(false)
      return
    }


    if (!isAuthenticated || !token) {

      setTrilhas([])
      setIsLoading(false)
      return
    }

    try {

      const response = await api.trails.getAll()

 
      if (response && response.data && Array.isArray(response.data)) {
        const trilhasNormalizadas: Trilha[] = response.data.map((trilha: any) => ({
          id: trilha.id,
          title: trilha.title || trilha.nome,
          nome: trilha.nome,
          descricao: trilha.descricao,
          image: trilha.image,
          backgroundSvg: trilha.backgroundSvg || "",
          etapas:
            trilha.etapas?.map((etapa: any) => ({
              id: etapa.id,
              title: etapa.title || etapa.titulo,
              titulo: etapa.titulo,
              descricao: etapa.descricao,
              icon: etapa.icon,
              iconLibrary: etapa.iconLibrary,
              imageUrl: etapa.imageUrl || "",
              stages:
                etapa.stages?.map((stage: any) => ({
                  ...stage,
                  questions:
                    stage.questions?.map((question: any) => fixQuestionType({
                      ...question,
                    })) || [],
                })) || [],
            })) || [],
        }))

        setTrilhas(trilhasNormalizadas)
      } else if (response && response.status === 200 && Array.isArray(response.data)) {
 
        setTrilhas(response.data)
      } else {

        setError("Formato de resposta inesperado da API")
      }
    } catch (err: any) {
   
      setError(err.message || "Não foi possível carregar as trilhas. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
   
    }
  }, [isAuthenticated, token])

  useEffect(() => {

    fetchTrilhas()
  }, [fetchTrilhas])

  return { trilhas, isLoading, error, refetch: fetchTrilhas }
}
