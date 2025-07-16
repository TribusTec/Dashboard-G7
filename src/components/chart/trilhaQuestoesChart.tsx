"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useTrails } from "@/hooks/useTrilhas"
import { HelpCircle } from "lucide-react"

export default function TrilhaQuestionsChart() {
  const { trilhas, isLoading } = useTrails()

  // Processar dados para mostrar os tipos de questões
  const getQuestionTypes = () => {
    // Objeto para armazenar contagem de cada tipo
    const typeCount: { [key: string]: number } = {}

    // Percorrer todas as trilhas, etapas, stages e questões
    trilhas.forEach((trilha) => {
      trilha.etapas?.forEach((etapa) => {
        etapa.stages?.forEach((stage) => {
          stage.questions?.forEach((question) => {
            // Incrementar contagem do tipo
            if (question.type) {
              typeCount[question.type] = (typeCount[question.type] || 0) + 1
            }
          })
        })
      })
    })

    // Converter para o formato esperado pelo gráfico
    return Object.entries(typeCount).map(([type, count]) => ({
      name: formatQuestionType(type),
      value: count,
      originalType: type,
    }))
  }

  // Formatar o tipo de questão para exibição
  const formatQuestionType = (type: string) => {
    const typeMap = {
      trueOrFalse: "Verdadeiro/Falso",
      multipleChoice: "Múltipla Escolha",
      matching: "Correspondência",
      ordering: "Ordenação",
      openEnded: "Resposta Aberta",
    }

    return typeMap[type as keyof typeof typeMap] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const questionTypeData = getQuestionTypes()

  // Cores para os diferentes tipos de questões
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tipos de Questões nas Trilhas</CardTitle>
        <HelpCircle className="h-5 w-5 text-marca" />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">Carregando dados...</div>
        ) : questionTypeData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">Nenhuma questão encontrada</div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={questionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {questionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} questões`, props.payload.name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-center text-muted-foreground">
              Este gráfico mostra a distribuição dos diferentes tipos de questões em todas as trilhas.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
