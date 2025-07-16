"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTrails } from "@/hooks/useTrilhas"
import { BookOpen } from "lucide-react"

export default function TrilhaStructureChart() {
  const { trilhas, isLoading } = useTrails()


  const trilhaData = trilhas.map((trilha) => {
    // Número de etapas
    const numEtapas = trilha.etapas?.length || 0

    // Número total de stages em todas as etapas
    const numStages =
      trilha.etapas?.reduce((total, etapa) => {
        return total + (etapa.stages?.length || 0)
      }, 0) || 0

    // Número total de questões em todos os stages
    const numQuestions =
      trilha.etapas?.reduce((total, etapa) => {
        return (
          total +
          (etapa.stages?.reduce((stageTotal, stage) => {
            return stageTotal + (stage.questions?.length || 0)
          }, 0) || 0)
        )
      }, 0) || 0

    // Tempo estimado total (em minutos)
    const tempoEstimadoTotal =
      trilha.etapas?.reduce((total, etapa) => {
        return (
          total +
          (etapa.stages?.reduce((stageTotal, stage) => {
            // Extrair apenas os números do tempo estimado (ex: "15-20 minutos" -> 17.5)
            const tempoTexto = stage.tempo_estimado || ""
            const numeros = tempoTexto.match(/\d+/g)
            let tempoMedio = 0

            if (numeros && numeros.length >= 1) {
              if (numeros.length >= 2) {
                // Se tem intervalo (ex: "15-20"), calcular a média
                tempoMedio = (Number.parseInt(numeros[0]) + Number.parseInt(numeros[1])) / 2
              } else {
                // Se tem apenas um número
                tempoMedio = Number.parseInt(numeros[0])
              }
            }

            return stageTotal + tempoMedio
          }, 0) || 0)
        )
      }, 0) || 0

    const nomeStr = String(trilha.nome)
    return {
      name: nomeStr.length > 15 ? nomeStr.substring(0, 15) + "..." : nomeStr,
      nomeCompleto: trilha.nome,
      etapas: numEtapas,
      stages: numStages,
      questoes: numQuestions,
      tempoEstimado: Math.round(tempoEstimadoTotal),
    }
  })
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Estrutura das Trilhas de Aprendizado</CardTitle>
        <BookOpen className="h-5 w-5 text-marca" />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">Carregando dados...</div>
        ) : trilhaData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">Nenhuma trilha encontrada</div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trilhaData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const label =
                        {
                          etapas: "Etapas",
                          stages: "Stages",
                          questoes: "Questões",
                          tempoEstimado: "Tempo Estimado (min)",
                        }[name] || name

                      return [value, label]
                    }}
                    labelFormatter={(label, items) => {
                      // Encontrar o item correspondente para obter o nome completo
                      const item = trilhaData.find((d) => d.name === label)
                      return item ? item.nomeCompleto : label
                    }}
                  />
                  <Legend
                    formatter={(value: string) => {
                      return (
                        {
                          etapas: "Etapas",
                          stages: "Stages",
                          questoes: "Questões",
                          tempoEstimado: "Tempo Estimado (min)",
                        }[value] || value
                      )
                    }}
                  />
                  <Bar dataKey="etapas" name="etapas" fill="#8884d8" />
                  <Bar dataKey="stages" name="stages" fill="#82ca9d" />
                  <Bar dataKey="questoes" name="questoes" fill="#ffc658" />
                  <Bar dataKey="tempoEstimado" name="tempoEstimado" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-center text-muted-foreground">
              Este gráfico mostra a estrutura de cada trilha: número de etapas, stages, questões e tempo estimado total
              (em minutos).
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
