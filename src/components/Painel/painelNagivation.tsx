"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, ChevronRight, FileText, ListChecks } from "lucide-react"
import { IconRenderer } from "./iconRender"
import type { Trilha, Etapa, Stage } from "@/types/painel"

interface PainelNavigationProps {
  currentView: "trilhas" | "etapas" | "stages" | "questions"
  selectedTrilha: Trilha | null
  selectedEtapa: Etapa | null
  selectedStage: Stage | null
  navigateToTrilhas: () => void
  navigateToEtapas: (trilha: Trilha) => void
  navigateToStages: (etapa: Etapa) => void
}

export function PainelNavigation({
  currentView,
  selectedTrilha,
  selectedEtapa,
  selectedStage,
  navigateToTrilhas,
  navigateToEtapas,
  navigateToStages,
}: PainelNavigationProps) {
  return (
    <nav className="flex items-center gap-2 text-sm  p-2 rounded-md">
      <Button variant="ghost" size="sm" className="flex items-center gap-1 font-semibold bg-marca text-white" onClick={navigateToTrilhas}>
        <BookOpen className="h-4 w-4" />
        Trilhas
      </Button>

      {selectedTrilha && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 font-semibold bg-marca text-white"
            onClick={() => navigateToEtapas(selectedTrilha)}
          >
            <ListChecks className="h-4 w-4" />
            {selectedTrilha.nome}
          </Button>
        </>
      )}

      {selectedEtapa && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 font-semibold bg-marca text-white"
            onClick={() => navigateToStages(selectedEtapa)}
          >
            <IconRenderer iconName={selectedEtapa.icon} />
            {selectedEtapa.titulo}
          </Button>
        </>
      )}

      {selectedStage && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button variant="ghost" size="sm" className="flex items-center gap-1 font-semibold bg-marca text-white">
            <FileText className="h-4 w-4" />
            {selectedStage.title}
          </Button>
        </>
      )}
    </nav>
  )
}
