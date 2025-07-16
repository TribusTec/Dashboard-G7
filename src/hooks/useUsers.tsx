"use client"

// src/hooks/useUsers.ts
import { useEffect, useState } from "react"
import { ref, get } from "firebase/database"
import { database } from "@/services/firebase"
import type { UserData } from "@/types/user"

// Função para formatar a data
function formatarData(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return "Sem registro"

  try {
    const data = new Date(timestamp)

    // Verificar se a data é válida
    if (isNaN(data.getTime())) return "Sem registro"

    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()
    const hora = String(data.getHours()).padStart(2, "0")
    const minutos = String(data.getMinutes()).padStart(2, "0")

    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return "Sem registro"
  }
}

export function useUsers(limit: number | null = 8) {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const usersRef = ref(database, "users")
        const snapshot = await get(usersRef)

        if (snapshot.exists()) {
          const data = snapshot.val()

          const formatted: UserData[] = Object.entries(data)
            .map(([uid, user]: [string, any]) => {
              const points = user.points || 0
              const desempenho =
                points >= 150 ? ("Bom" as const) : points >= 100 ? ("Médio" as const) : ("Ruim" as const)

              // Verificar se createdAt existe e é um número válido
              let createdAtTimestamp = 0
              if (user.createdAt) {
                if (typeof user.createdAt === "number") {
                  createdAtTimestamp = user.createdAt
                } else if (typeof user.createdAt === "string") {
                  const parsed = Number.parseInt(user.createdAt)
                  if (!isNaN(parsed)) {
                    createdAtTimestamp = parsed
                  }
                }
              }

              return {
                id: uid,
                nome: user.nome || "Sem Nome",
                sobrenome: user.sobrenome || "",
                email: user.email || "",
                phone: user.phone || "",
                avatarId: user.avatarId || "",
                avatarSource: user.avatarSource || "",
                birthDate: user.birthDate || "",
                createdAt: createdAtTimestamp,
                ultimoAcesso: formatarData(createdAtTimestamp),
                points,
                desempenho,
              }
            })
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, limit || data.length) // Se limit for null, exibe todos os usuários

          setUsers(formatted)
        } else {
          setUsers([])
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [limit])

  return { users, loading, setUsers } // Retorna o setUsers
}
