"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/context/authContext"
import { useTrails } from "@/hooks/useTrilhas"
import { PainelSkeleton } from "@/components/Painel/painelSkeleton"
import { PainelContent } from "@/components/Painel/painelContent"
import { PageTitle } from "@/components/Head"
import { ProtectedRoute } from "@/components/rotaSegura"

function PainelPageContent() {
  const { isAuthenticated, isLoading: authLoading, showLoadingTransition } = useAuth()
  const { trilhas, isLoading: trilhasLoading, error, refetch } = useTrails()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || trilhasLoading || showLoadingTransition) {
    return (
      <>
        <Sidebar />
        <div className="sm:ml-64 p-4">
          <PainelSkeleton />
        </div>
      </>
    )
  }

  const trilhasFormatted = trilhas.map((trilha) => ({
    ...trilha,
    title: typeof trilha.nome === "string" ? trilha.nome : String(trilha.nome),
    nome: typeof trilha.nome === "string" ? trilha.nome : String(trilha.nome),
    descricao: typeof trilha.descricao === "string" ? trilha.descricao : String(trilha.descricao),
    backgroundSvg: trilha.backgroundSvg || "",
    etapas: trilha.etapas.map((etapa) => ({
      ...etapa,
      title: typeof etapa.titulo === "string" ? etapa.titulo : String(etapa.titulo),
      nome: typeof etapa.titulo === "string" ? etapa.titulo : String(etapa.titulo),
      titulo: typeof etapa.titulo === "string" ? etapa.titulo : String(etapa.titulo),
      descricao: typeof etapa.descricao === "string" ? etapa.descricao : String(etapa.descricao),
      icon: etapa.icon || etapa.icone || "",
      iconLibrary: etapa.iconLibrary || "",
      imageUrl: etapa.imageUrl || "",
      stages: etapa.stages || [],
    })),
  }))

  return (
    <>
      <PageTitle title="Painel" />
      <Sidebar />
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl sm:ml-64">
        <PainelContent trilhas={trilhasFormatted} refetch={refetch} />
      </div>
    </>
  )
}

export default function PainelPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <PainelPageContent />
    </ProtectedRoute>
  )
}
