export interface Stage {
  id: string
  title: string
  description: string
  image?: string
  video?: string
  tempo_estimado: string
  pontos_chave: string[]
  questions: Question[]
  completed: boolean
}

export interface Question {
  id: string
  type: string
  description: string
  isTrue?: boolean
  explanation: string
}

export interface Etapa {
  id: string
  titulo: string
  descricao: string
  icon?: string
  icone?: string // Para compatibilidade com ambos os formatos
  iconLibrary?: string
  concluida: boolean
  stages?: Stage[]
}

export interface Trilha {
  id: string
  nome: string
  descricao: string
  image?: string
  backgroundImage?: string
  backgroundSvg?: string
  backgroundColor?: string
  etapas: Etapa[]
}

export interface ApiResponse {
  status: number
  message: string
  count: number
  data: Trilha[]
}
