"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useUsers } from "@/hooks/useUsers"
import { TrendingUp } from "lucide-react"

export default function UserProgressChart() {
  const { users, loading } = useUsers(null)

  // Dados simulados de progresso ao longo do tempo (últimos 6 meses)
  // Em um ambiente real, estes dados viriam do banco de dados
  const currentDate = new Date()
  const progressData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(currentDate)
    month.setMonth(currentDate.getMonth() - (5 - i))

    // Simular crescimento de usuários e pontuação média
    const baseUsers = 10
    const growthRate = 1.2
    const userCount = Math.floor(baseUsers * Math.pow(growthRate, i))

    // Pontuação média simulada (crescendo gradualmente)
    const avgScore = 30 + i * 5 + Math.floor(Math.random() * 10)

    return {
      month: month.toLocaleDateString("pt-BR", { month: "short" }),
      usuarios: userCount,
      pontuacao: avgScore,
    }
  })

  // Adicionar dados reais do mês atual (se disponíveis)
  if (!loading && users && users.length > 0) {
    const currentMonth = currentDate.toLocaleDateString("pt-BR", { month: "short" })
    const avgUserScore = users.reduce((sum, user) => sum + (user.points || 0), 0) / users.length

    // Atualizar o último mês com dados reais
    progressData[progressData.length - 1] = {
      month: currentMonth,
      usuarios: users.length,
      pontuacao: Math.round(avgUserScore),
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Progresso ao Longo do Tempo</CardTitle>
        <TrendingUp className="h-5 w-5 text-marca" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">Carregando dados...</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                  formatter={(value, name) => {
                    if (name === "usuarios") return [`${value} usuários`, "Usuários"]
                    if (name === "pontuacao") return [`${value} pontos`, "Pontuação Média"]
                    return [value, name]
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="usuarios"
                  name="Usuários"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pontuacao"
                  name="Pontuação Média"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Evolução do número de usuários e pontuação média nos últimos 6 meses
        </div>
      </CardContent>
    </Card>
  )
}
