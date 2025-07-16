"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ChartContainer, type ChartConfig, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, BarChart, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"

export default function ChartOverView() {
  const chartData = [
    { month: "Janeiro", sales: 266 },
    { month: "Fevereiro", sales: 505 },
    { month: "Março", sales: 357 },
    { month: "Abril", sales: 263 },
    { month: "Maio", sales: 339 },
    { month: "Junho", sales: 354 },
    { month: "Julho", sales: 554 },
  ]


  const [selectedMonth, setSelectedMonth] = useState(chartData[0])

  const chartConfig = {
    sales: {
      label: "Vendas",
      color: "#F4855D",
    },
  } satisfies ChartConfig


  const handleBarClick = (data: any) => {

    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload
      if (clickedData) {
        setSelectedMonth(clickedData)
      }
    }
  }

  return (
    <Card className="flex-1 w-full md:w-full md:max-w-[700px] ml-auto">
      <CardHeader>
        <div className="flex-col items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800">Vendas Mensal</CardTitle>
          <span>   Clique nas barras para ver detalhes do mês</span>
          <DollarSign className="ml-auto w-4 h-4" />
        </div>

      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
          <BarChart data={chartData} onClick={handleBarClick} className="cursor-pointer">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar dataKey="sales" fill="var(--color-sales)" radius={4}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={selectedMonth.month === entry.month ? "#EB5D1C" : "#EB5D1Cd1"}
                  opacity={selectedMonth.month === entry.month ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{selectedMonth.month}</h3>
          <Badge variant="outline" className="bg-primary/10">
            R$ {selectedMonth.sales.toLocaleString("pt-BR")}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

