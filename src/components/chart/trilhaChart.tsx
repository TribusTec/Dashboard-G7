"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useTrails } from "@/hooks/useTrilhas"
import { BookOpen } from "lucide-react"

export default function TrailCompletionChart() {
  const { trilhas, isLoading } = useTrails()

  // Simplificar os dados para o gráfico
  const trailData = trilhas.map((trilha) => {
    // Para cada trilha, calcular quantas etapas têm stages
    const etapasComStages = trilha.etapas?.filter((etapa) => etapa.stages && etapa.stages.length > 0) || []

    // Total de stages em todas as etapas
    const totalStages = etapasComStages.reduce((total, etapa) => total + (etapa.stages?.length || 0), 0)

    // Total de stages completados
    const completedStages = etapasComStages.reduce(
      (total, etapa) => total + (etapa.stages?.filter((stage) => stage.completed)?.length || 0),
      0,
    )

    // Taxa de conclusão (evitar divisão por zero)
    const completionRate = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0

    return {
      name: trilha.nome,
      taxa: completionRate,
      total: totalStages,
      concluidos: completedStages,
    }
  })

  // Cores para as barras
  const getBarColor = (rate: number) => {
    if (rate < 30) return "#ef4444" // Vermelho para baixa conclusão
    if (rate < 70) return "#f59e0b" // Amarelo para média conclusão
    return "#10b981" // Verde para alta conclusão
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Taxa de Conclusão das Trilhas</CardTitle>
        <BookOpen className="h-5 w-5 text-marca" />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">Carregando dados...</div>
        ) : trailData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">Nenhuma trilha encontrada</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trailData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 20)}...` : value)}
                />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, "Taxa de Conclusão"]}
                  labelFormatter={(label) => `Trilha: ${label}`}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                />
                <Bar dataKey="taxa" name="Taxa de Conclusão" radius={[0, 4, 4, 0]}>
                  {trailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.taxa)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex justify-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs">Baixa (&lt;30%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-xs">Média (30-70%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className="text-xs">Alta (&gt;70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
