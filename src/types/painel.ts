import type { ReactNode } from "react"

export enum QuestionType {
  trueOrFalse = "trueOrFalse",
  multipleChoice = "multipleChoice",
  ORDERING = "ordering",
  MATCHING = "matching",
}

export interface QuestionOption {
  id: string
  text: string
  imageUrl?: string
}

export interface MatchingPair {
  left: string
  right: string
}

export interface Question {
  id: string
  type: QuestionType
  description: string
  descriptionImageUrl?: string
  explanation?: string
  isTrue?: boolean
  options?: QuestionOption[]
  correctOptions?: string[]
  multipleCorrect?: boolean
  items?: QuestionOption[]
  correctOrder?: string[]
  statementText?: string
  leftColumn?: QuestionOption[]
  rightColumn?: QuestionOption[]
  correctMatches?: MatchingPair[]
  correctExplanation?: {
    title: string
    description: string
    imageUrl?: string
  }
  incorrectExplanation?: {
    title: string
    description: string
    imageUrl?: string
  }
}

export interface Stage {
  completed: unknown
  id: string
  title: string
  description?: string
  tempo_estimado?: string
  image?: string
  video?: string
  pontos_chave?: string[]
  questions?: Question[]
  ordem?: number
}

export interface Etapa {
  icone: string
  id: string
  titulo: ReactNode 
  descricao: ReactNode
  icon: string
  iconLibrary: string
  imageUrl?: string 
  stages: Stage[]
}

export interface Trilha {
  id: string
  nome: ReactNode 
  descricao: ReactNode
  image: string
  backgroundSvg?: string | boolean
  etapas: Etapa[]
}

export interface ApiResponse {
  status: number
  message: string
  count: number
  data: Trilha[]
}


export interface TrilhaFromAPI {
  id: string
  nome: ReactNode 
  descricao: ReactNode
  image: string
  backgroundSvg?: string | boolean | undefined
  etapas: Etapa[]
}
