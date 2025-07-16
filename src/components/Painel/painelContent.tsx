"use client"

import { useState } from "react"
import { PainelTrilhas } from "./painelTrilhas"
import { PainelEtapas } from "./painelEtapas"
import { PainelStages } from "./painelStage"
import { PainelQuestions } from "./painelQuestoes"
import { PainelNavigation } from "./painelNagivation"
import type { Trilha, Etapa, Stage } from "@/types/painel"

interface PainelContentProps {
  trilhas: Trilha[]
  refetch: () => Promise<void>
}

export function PainelContent({ trilhas, refetch }: PainelContentProps) {
  // Estados para navegação
  const [currentView, setCurrentView] = useState<"trilhas" | "etapas" | "stages" | "questions">("trilhas")
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null)
  const [selectedEtapa, setSelectedEtapa] = useState<Etapa | null>(null)
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)

  // Funções de navegação
  async function navigateToTrilhas() {
    setCurrentView("trilhas")
    setSelectedTrilha(null)
    setSelectedEtapa(null)
    setSelectedStage(null)
    await refetch()
  }

  function navigateToEtapas(trilha: Trilha) {
    setCurrentView("etapas")
    setSelectedTrilha(trilha)
    setSelectedEtapa(null)
    setSelectedStage(null)
  }

  function navigateToStages(etapa: Etapa) {
    setCurrentView("stages")
    setSelectedEtapa(etapa)
    setSelectedStage(null)
  }

  function navigateToQuestions(stage: Stage) {
    setCurrentView("questions")
    setSelectedStage(stage)
  }

  return (
    <div className="flex flex-col gap-6">
      <PainelNavigation
        currentView={currentView}
        selectedTrilha={selectedTrilha}
        selectedEtapa={selectedEtapa}
        selectedStage={selectedStage}
        navigateToTrilhas={navigateToTrilhas}
        navigateToEtapas={navigateToEtapas}
        navigateToStages={navigateToStages}
      />

      {currentView === "trilhas" && (
        <PainelTrilhas trilhas={trilhas} refetch={refetch} navigateToEtapas={navigateToEtapas} />
      )}

      {currentView === "etapas" && selectedTrilha && (
        <PainelEtapas
          selectedTrilha={selectedTrilha}
          refetch={refetch}
          navigateToTrilhas={navigateToTrilhas}
          navigateToStages={navigateToStages}
          setSelectedTrilha={setSelectedTrilha}
        />
      )}

      {currentView === "stages" && selectedTrilha && selectedEtapa && (
        <PainelStages
          selectedTrilha={selectedTrilha}
          selectedEtapa={selectedEtapa}
          refetch={refetch}
          navigateToEtapas={navigateToEtapas}
          navigateToQuestions={navigateToQuestions}
          setSelectedTrilha={setSelectedTrilha}
          setSelectedEtapa={setSelectedEtapa}
        />
      )}

      {currentView === "questions" && selectedTrilha && selectedEtapa && selectedStage && (
        <PainelQuestions
          selectedTrilha={selectedTrilha}
          selectedEtapa={selectedEtapa}
          selectedStage={selectedStage}
          refetch={refetch}
          navigateToStages={navigateToStages}
          setSelectedTrilha={setSelectedTrilha}
          setSelectedEtapa={setSelectedEtapa}
          setSelectedStage={setSelectedStage}
        />
      )}
    </div>
  )
}
