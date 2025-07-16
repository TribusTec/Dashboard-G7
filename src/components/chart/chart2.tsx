/* "use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ChartContainer, type ChartConfig, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Tooltip, Legend, Label } from "recharts"
import { Badge } from "@/components/ui/badge"

export default function Chart2() {
 
  const chartData = [
    { name: "Coca Cola Lata", sales: 266 },
    { name: "Água Mineral", sales: 505 },
    { name: "Cerveja", sales: 357 },
    { name: "Salgadinho", sales: 263 },
  ]

  const [selectedProduct, setSelectedProduct] = useState(chartData[0])

  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0)

  const chartConfig = {
    sales: {
      label: "Vendas",
      color: "#F4855D",
    },
  } satisfies ChartConfig

  const productColors: { [key: string]: string } = {
    "Coca Cola Lata": "#FF6347",
    "Água Mineral": "#1E90FF",
    "Cerveja": "#FFD700",
    "Salgadinho": "#32CD32",
  };

  const handlePieClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload
      if (clickedData) {
        setSelectedProduct(clickedData)
      }
    }
  }

  return (
    <Card className="flex-1 w-full md:w-full md:max-w-[700px] ml-auto">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-800">Produtos Mais Vendidos</CardTitle>
          <DollarSign className="ml-auto w-4 h-4" />
        </div>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Clique nas fatias para ver detalhes do produto
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <PieChart onClick={handlePieClick} className="cursor-pointer">
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={0}  
              outerRadius={90} 
              fill="var(--color-sales)"
              label
            >
              {chartData.map((entry, index) => {
                const percentage = ((entry.sales / totalSales) * 100).toFixed(2)
                const productColor = productColors[entry.name] || "var(--color-sales)"

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={selectedProduct.name === entry.name ? "#FF3F16" : productColor} // Destaca o produto selecionado
                    opacity={selectedProduct.name === entry.name ? 1 : 0.8} // Diminui a opacidade dos outros produtos
                  >
                    <Label
                      position="center"
                      value={`${percentage}%`}
                      fontSize={12}
                      fill={selectedProduct.name === entry.name ? "#FF3F16" : "#FFFFFF"}
                    />
                    <Label
                      position="center"
                      value={`R$ ${entry.sales.toLocaleString("pt-BR")}`}
                      fontSize={12}
                      fill={selectedProduct.name === entry.name ? "#FF3F16" : "#FFFFFF"}
                    />
                  </Cell>
                )
              })}
            </Pie>
            <Legend />
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
          <Badge variant="outline" className="bg-primary/10">
            R$ {selectedProduct.sales.toLocaleString("pt-BR")}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
 */