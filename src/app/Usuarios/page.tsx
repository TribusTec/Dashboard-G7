"use client"
import { Sidebar } from "@/components/sidebar"
import UsuariosTotal from "@/components/UsuariosTotal"
import { PageTitle } from "@/components/Head"
import { ProtectedRoute } from "@/components/rotaSegura"

function UsuariosPageContent() {
  return (
    <>
      <PageTitle title="Usuários" />
      <Sidebar />
      <main className="sm:ml-64 p-4">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4"></section>
        <UsuariosTotal />
      </main>
    </>
  )
}

export default function UsuariosPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <UsuariosPageContent />
    </ProtectedRoute>
  )
}
