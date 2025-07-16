import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Medal, Award, Star } from "lucide-react"

// Avatar options for the application
const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

// Consistent theme configuration for each rank
export const rankThemes = {
  1: {
    name: "gold",
    icon: Crown,
    bgClass: "bg-amber-500",
    textClass: "text-amber-50",
    borderClass: "border-amber-300",
    badgeClass: "bg-amber-200 text-amber-800",
  },
  2: {
    name: "silver",
    icon: Medal,
    bgClass: "bg-slate-400",
    textClass: "text-slate-50",
    borderClass: "border-slate-300",
    badgeClass: "bg-slate-200 text-slate-800",
  },
  3: {
    name: "bronze",
    icon: Award,
    bgClass: "bg-amber-700",
    textClass: "text-amber-50",
    borderClass: "border-amber-600",
    badgeClass: "bg-amber-200 text-amber-800",
  },
  default: {
    name: "default",
    icon: Star,
    bgClass: "bg-muted",
    textClass: "text-foreground",
    borderClass: "border-muted-foreground/30",
    badgeClass: "bg-muted-foreground/20 text-muted-foreground",
  },
}

// Helper functions
export const getInitials = (name: string) => {
  if (!name) return "U"
  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export const getAvatarImage = (avatarId: string) => {
  const avatar = avatarOptions.find((a) => a.id === avatarId)
  return avatar ? avatar.image : null
}

// Props interface for the RankingCard component
interface RankingCardProps {
  user: {
    id: string
    nome: string
    sobrenome: string
    email: string
    points: number
    desempenho: string
    avatarId?: string
  }
  position: number
}

export function RankingCard({ user, position }: RankingCardProps) {

  const theme = rankThemes[position as keyof typeof rankThemes] || rankThemes.default
  const IconComponent = theme.icon

  
  const heightClass = position === 1 ? "h-80" : position === 2 ? "h-72" : "h-64"

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative w-40 ${heightClass}
          ${theme.bgClass}
          rounded-lg shadow-md
          flex flex-col items-center justify-between
          p-6 ${theme.textClass}
          transition-transform duration-300 hover:translate-y-[-5px]
        `}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Avatar className={`w-20 h-20 border-2 ${theme.borderClass}`}>
              {user.avatarId ? (
                <AvatarImage src={getAvatarImage(user.avatarId) || ""} alt={`Avatar de ${user.nome}`} />
              ) : (
                <AvatarImage src="/avatars/avatar1.png" alt="Avatar padrão" />
              )}
              <AvatarFallback className="bg-background text-foreground font-bold">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -top-2 -right-2 bg-background rounded-full p-1.5 shadow-sm">
              <IconComponent className="w-4 h-4 text-foreground" />
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-lg font-bold capitalize truncate max-w-[140px]">
              {user.nome} {user.sobrenome}
            </h4>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold">{user.points}</div>
            <div className="text-sm font-medium opacity-80">Pontos</div>
          </div>
        </div>

        <div className="mt-4">
          <div className={`${theme.badgeClass} rounded-md px-3 py-1`}>
            <span className="text-xs font-medium">{user.desempenho}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center w-8 h-8 bg-background rounded-full shadow-sm border border-border">
        <span className="text-foreground font-bold text-sm">#{position}</span>
      </div>
    </div>
  )
}