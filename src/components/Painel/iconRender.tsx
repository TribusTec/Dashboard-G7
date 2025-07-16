import {
  BookOpen,
  BookOpenText,
  Code,
  Layout,
  Video,
  FileText,
  CheckCircle2,
  Puzzle,
  Lightbulb,
  Rocket,
  Zap,
} from "lucide-react"

export const AVAILABLE_ICONS = [
  { value: "book-open", label: "Livro Aberto", icon: BookOpen },
  { value: "book-open-text", label: "Livro com Texto", icon: BookOpenText },
  { value: "code", label: "Código", icon: Code },
  { value: "layout", label: "Layout", icon: Layout },
  { value: "video", label: "Vídeo", icon: Video },
  { value: "file-text", label: "Documento", icon: FileText },
  { value: "check-circle", label: "Concluído", icon: CheckCircle2 },
  { value: "puzzle", label: "Puzzle", icon: Puzzle },
  { value: "lightbulb", label: "Ideia", icon: Lightbulb },
  { value: "rocket", label: "Foguete", icon: Rocket },
  { value: "zap", label: "Raio", icon: Zap },
]

export function IconRenderer({ iconName }: { iconName: string }) {
  // Encontrar o ícone correspondente no array AVAILABLE_ICONS
  const iconConfig = AVAILABLE_ICONS.find((icon) => icon.value === iconName)

  // Se encontrou o ícone, renderiza o componente do ícone
  if (iconConfig && iconConfig.icon) {
    const IconComponent = iconConfig.icon
    return <IconComponent className="h-5 w-5" />
  }

  // Caso não encontre, usa o ícone padrão BookOpen
  return <BookOpen className="h-5 w-5" />
}
