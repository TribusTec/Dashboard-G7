"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useUsers } from "@/hooks/useUsers"
import type { UserData } from "@/types/user"
import { Users } from "lucide-react"

export default function UserPerformanceChart() {
  const { users, loading } = useUsers(null)

  // Função para determinar o nível de desempenho com base na pontuação
  const getPerformanceLevel = (user: UserData) => {
    const points = user.points || 0

    if (points >= 70) return "Bom"
    if (points >= 40) return "Médio"
    return "Iniciante"
  }

  // Processar dados dos usuários para o gráfico
  const performanceData =
    !loading && users
      ? users.reduce(
          (acc, user) => {
            const level = getPerformanceLevel(user)
            const existingLevel = acc.find((item) => item.name === level)

            if (existingLevel) {
              existingLevel.value += 1
            } else {
              acc.push({ name: level, value: 1 })
            }

            return acc
          },
          [] as { name: string; value: number }[],
        )
      : []

  // Cores para cada nível de desempenho
  const COLORS = {
    Bom: "#10b981", // Verde
    Médio: "#f59e0b", // Amarelo
    Iniciante: "#ef4444", // Vermelho
  }

  // Ordenar para manter a ordem consistente
  const sortedData = performanceData.sort((a, b) => {
    const order = ["Iniciante", "Médio", "Bom"]
    return order.indexOf(a.name) - order.indexOf(b.name)
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Desempenho dos Usuários</CardTitle>
        <Users className="h-5 w-5 text-marca" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">Carregando dados...</div>
        ) : sortedData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">Nenhum dado de usuário disponível</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] } />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} usuários`, name]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Distribuição dos usuários por nível de desempenho baseado na pontuação
        </div>
      </CardContent>
    </Card>
  )
}
