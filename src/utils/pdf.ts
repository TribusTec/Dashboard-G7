import { jsPDF } from "jspdf"
import type { UserData } from "@/types/user"


const PDF_COLORS = {
  primary: [0, 132, 174], 
  text: [0, 0, 0], 
  subtitle: [100, 100, 100], 
  line: [220, 220, 220], 
  white: [255, 255, 255],
  lightGray: [245, 245, 245], 
  border: [200, 200, 200], 
  footer: [150, 150, 150], 
} as const


export const generateUserListPDF = (users: UserData[]) => {
  const doc = new jsPDF("landscape")

 
  doc.setFontSize(20)
  doc.setTextColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.text("Lista Completa de Usuários", 148, 15, { align: "center" })


  doc.setFontSize(10)
  doc.setTextColor(PDF_COLORS.subtitle[0], PDF_COLORS.subtitle[1], PDF_COLORS.subtitle[2])
  doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 148, 22, {
    align: "center",
  })

 
  doc.setDrawColor(PDF_COLORS.line[0], PDF_COLORS.line[1], PDF_COLORS.line[2])
  doc.line(10, 25, 285, 25)

 
  doc.setFontSize(12)
  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])
  doc.text(`Total de usuários: ${users.length}`, 10, 35)

  
  const margin = 10
  let yPos = 45
  const rowHeight = 12


  const colWidths = [65, 95, 30, 35, 40]
  const totalWidth = colWidths.reduce((a, b) => a + b, 0)

  
  doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  const xPos = margin

 
  doc.rect(xPos, yPos, colWidths[0], rowHeight, "F")
  doc.rect(xPos + colWidths[0], yPos, colWidths[1], rowHeight, "F")
  doc.rect(xPos + colWidths[0] + colWidths[1], yPos, colWidths[2], rowHeight, "F")
  doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2], yPos, colWidths[3], rowHeight, "F")
  doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos, colWidths[4], rowHeight, "F")


  doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
  doc.setFontSize(10)
  doc.text("Nome", xPos + 4, yPos + 6.5)
  doc.text("Email", xPos + colWidths[0] + 4, yPos + 6.5)
  doc.text("Pontos", xPos + colWidths[0] + colWidths[1] + 4, yPos + 6.5)
  doc.text("Desempenho", xPos + colWidths[0] + colWidths[1] + colWidths[2] + 4, yPos + 6.5)
  doc.text("Data de Cadastro", xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 4, yPos + 6.5)

  yPos += rowHeight


  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])
  doc.setFontSize(8)


  let currentPage = 1
  const itemsPerPage = 16 

 
  users.forEach((user, index) => {
    
    if (index > 0 && index % itemsPerPage === 0) {
    
      doc.setFontSize(8)
      doc.setTextColor(PDF_COLORS.subtitle[0], PDF_COLORS.subtitle[1], PDF_COLORS.subtitle[2])
      doc.text(`Página ${currentPage}`, 148, 195, { align: "center" })

     
      doc.addPage("landscape")
      currentPage++
      yPos = 20

      doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
      doc.rect(xPos, yPos, colWidths[0], rowHeight, "F")
      doc.rect(xPos + colWidths[0], yPos, colWidths[1], rowHeight, "F")
      doc.rect(xPos + colWidths[0] + colWidths[1], yPos, colWidths[2], rowHeight, "F")
      doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2], yPos, colWidths[3], rowHeight, "F")
      doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos, colWidths[4], rowHeight, "F")

      doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
      doc.setFontSize(10)
      doc.text("Nome", xPos + 4, yPos + 6.5)
      doc.text("Email", xPos + colWidths[0] + 4, yPos + 6.5)
      doc.text("Pontos", xPos + colWidths[0] + colWidths[1] + 4, yPos + 6.5)
      doc.text("Desempenho", xPos + colWidths[0] + colWidths[1] + colWidths[2] + 4, yPos + 6.5)
      doc.text("Data de Cadastro", xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 4, yPos + 6.5)

      yPos += rowHeight
      doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])
      doc.setFontSize(8)
    }

    // Alternar cores de fundo para melhor legibilidade
    if (index % 2 === 0) {
      doc.setFillColor(PDF_COLORS.lightGray[0], PDF_COLORS.lightGray[1], PDF_COLORS.lightGray[2])
    } else {
      doc.setFillColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
    }

    // Desenhar células
    doc.rect(xPos, yPos, colWidths[0], rowHeight, "F")
    doc.rect(xPos + colWidths[0], yPos, colWidths[1], rowHeight, "F")
    doc.rect(xPos + colWidths[0] + colWidths[1], yPos, colWidths[2], rowHeight, "F")
    doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2], yPos, colWidths[3], rowHeight, "F")
    doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos, colWidths[4], rowHeight, "F")

    // Adicionar bordas
    doc.setDrawColor(PDF_COLORS.border[0], PDF_COLORS.border[1], PDF_COLORS.border[2])
    doc.rect(xPos, yPos, colWidths[0], rowHeight, "S")
    doc.rect(xPos + colWidths[0], yPos, colWidths[1], rowHeight, "S")
    doc.rect(xPos + colWidths[0] + colWidths[1], yPos, colWidths[2], rowHeight, "S")
    doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2], yPos, colWidths[3], rowHeight, "S")
    doc.rect(xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos, colWidths[4], rowHeight, "S")

    // Truncar apenas nomes muito longos, mas manter emails completos
    const nome =
      `${user.nome} ${user.sobrenome || ""}`.length > 35
        ? `${user.nome} ${user.sobrenome || ""}`.substring(0, 32) + "..."
        : `${user.nome} ${user.sobrenome || ""}`

    // Adicionar texto
    doc.text(nome, xPos + 4, yPos + 6.5)
    doc.text(user.email || "N/A", xPos + colWidths[0] + 4, yPos + 6.5)
    doc.text(user.points?.toString() || "0", xPos + colWidths[0] + colWidths[1] + 4, yPos + 6.5)
    doc.text(user.desempenho || "N/A", xPos + colWidths[0] + colWidths[1] + colWidths[2] + 4, yPos + 6.5)
    doc.text(
      formatarData(user.createdAt) || "N/A",
      xPos + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 4,
      yPos + 6.5,
    )

    yPos += rowHeight
  })

  // Adicionar rodapé na última página
  doc.setFontSize(8)
  doc.setTextColor(PDF_COLORS.subtitle[0], PDF_COLORS.subtitle[1], PDF_COLORS.subtitle[2])
  doc.text(`Página ${currentPage} de ${currentPage}`, 148, 195, { align: "center" })
  doc.text("© G7", 148, 200, { align: "center" })

  // Salvar o PDF
  doc.save("lista-completa-usuarios.pdf")
}

// Função para gerar o PDF do Dashboard
export const generateDashboardPDF = (
  totalUsers: number,
  totalTrilhas: number,
  totalEtapas: number,
  trilhasData: any[],
) => {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(20)
  doc.setTextColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.text("Relatório Geral G7", 105, 15, { align: "center" })

  // Data de geração
  doc.setFontSize(10)
  doc.setTextColor(PDF_COLORS.subtitle[0], PDF_COLORS.subtitle[1], PDF_COLORS.subtitle[2])
  doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 105, 22, {
    align: "center",
  })

  // Linha separadora
  doc.setDrawColor(PDF_COLORS.line[0], PDF_COLORS.line[1], PDF_COLORS.line[2])
  doc.line(20, 25, 190, 25)

  // Estatísticas gerais
  doc.setFontSize(14)
  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])
  doc.text("Estatísticas Gerais", 20, 35)

  // Criando tabela de estatísticas manualmente
  let yPos = 40
  const colWidth = 85
  const rowHeight = 10
  const margin = 20

  // Cabeçalho da tabela
  doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.rect(margin, yPos, colWidth, rowHeight, "F")
  doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

  doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
  doc.setFontSize(11)
  doc.text("Métrica", margin + 5, yPos + 5.5)
  doc.text("Valor", margin + colWidth + 5, yPos + 5.5)

  yPos += rowHeight

  // Linhas da tabela
  const estatisticasData = [
    ["Total de Usuários", totalUsers.toString()],
    ["Total de Trilhas", totalTrilhas.toString()],
    ["Total de Etapas", totalEtapas.toString()],
    ["Média de Etapas por Trilha", (totalEtapas / (totalTrilhas || 1)).toFixed(2)],
  ]

  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])

  estatisticasData.forEach((row, index) => {
    // Alternar cores de fundo para melhor legibilidade
    if (index % 2 === 0) {
      doc.setFillColor(PDF_COLORS.lightGray[0], PDF_COLORS.lightGray[1], PDF_COLORS.lightGray[2])
    } else {
      doc.setFillColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
    }

    doc.rect(margin, yPos, colWidth, rowHeight, "F")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

    // Bordas da célula
    doc.setDrawColor(PDF_COLORS.border[0], PDF_COLORS.border[1], PDF_COLORS.border[2])
    doc.rect(margin, yPos, colWidth, rowHeight, "S")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "S")

    doc.text(row[0], margin + 5, yPos + 5.5)
    doc.text(row[1], margin + colWidth + 5, yPos + 5.5)

    yPos += rowHeight
  })

  // Análise de trilhas
  yPos += 15
  doc.setFontSize(14)
  doc.text("Análise de Trilhas", 20, yPos)
  yPos += 10

  // Tabela de trilhas (removida coluna de tipos de minigames)
  if (trilhasData && trilhasData.length > 0) {
    // Cabeçalho da tabela de trilhas
    const trilhaColWidths = [120, 50]

    doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
    doc.rect(margin, yPos, trilhaColWidths[0], rowHeight, "F")
    doc.rect(margin + trilhaColWidths[0], yPos, trilhaColWidths[1], rowHeight, "F")

    doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
    doc.setFontSize(11)
    doc.text("Nome da Trilha", margin + 5, yPos + 5.5)
    doc.text("Qtd. Etapas", margin + trilhaColWidths[0] + 5, yPos + 5.5)

    yPos += rowHeight
    doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])

    // Verificar se precisamos de uma nova página
    const maxRowsPerPage = Math.floor((270 - yPos) / rowHeight)
    let rowCount = 0

    trilhasData.forEach((trilha, index) => {
      // Verificar se precisamos de uma nova página
      if (rowCount >= maxRowsPerPage) {
        doc.addPage()
        yPos = 20
        rowCount = 0
      }

      // Alternar cores de fundo
      if (index % 2 === 0) {
        doc.setFillColor(PDF_COLORS.lightGray[0], PDF_COLORS.lightGray[1], PDF_COLORS.lightGray[2])
      } else {
        doc.setFillColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
      }

      // Células da tabela
      doc.rect(margin, yPos, trilhaColWidths[0], rowHeight, "F")
      doc.rect(margin + trilhaColWidths[0], yPos, trilhaColWidths[1], rowHeight, "F")

      // Bordas
      doc.setDrawColor(PDF_COLORS.border[0], PDF_COLORS.border[1], PDF_COLORS.border[2])
      doc.rect(margin, yPos, trilhaColWidths[0], rowHeight, "S")
      doc.rect(margin + trilhaColWidths[0], yPos, trilhaColWidths[1], rowHeight, "S")

      // Texto
      const nomeTrilha = trilha.nome.length > 50 ? trilha.nome.substring(0, 47) + "..." : trilha.nome
      doc.text(nomeTrilha, margin + 5, yPos + 5.5)
      doc.text((trilha.etapas?.length || 0).toString(), margin + trilhaColWidths[0] + 5, yPos + 5.5)

      yPos += rowHeight
      rowCount++
    })
  } else {
    doc.text("Nenhuma trilha encontrada.", 20, yPos + 10)
    yPos += 20
  }

  // Desempenho dos usuários
  yPos += 15
  doc.setFontSize(14)
  doc.text("Desempenho dos Usuários", 20, yPos)
  yPos += 7
  doc.setFontSize(11)
  doc.text("Esta seção apresenta um resumo do desempenho dos usuários na plataforma.", 20, yPos)

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(PDF_COLORS.footer[0], PDF_COLORS.footer[1], PDF_COLORS.footer[2])
    doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" })
    doc.text("© G7", 105, 290, { align: "center" })
  }

  // Salvar o PDF
  doc.save("dashboard-report.pdf")
}

// Função para gerar o PDF de um usuário específico
export const generateUserPDF = (user: UserData) => {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(20)
  doc.setTextColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.text(`Relatório do Cliente: ${user.nome} ${user.sobrenome || ""}`, 105, 15, { align: "center" })

  // Data de geração
  doc.setFontSize(10)
  doc.setTextColor(PDF_COLORS.subtitle[0], PDF_COLORS.subtitle[1], PDF_COLORS.subtitle[2])
  doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 105, 22, {
    align: "center",
  })

  // Linha separadora
  doc.setDrawColor(PDF_COLORS.line[0], PDF_COLORS.line[1], PDF_COLORS.line[2])
  doc.line(20, 25, 190, 25)

  // Informações do usuário
  doc.setFontSize(14)
  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])
  doc.text("Informações Pessoais", 20, 35)

  // Criando tabela de informações pessoais manualmente
  let yPos = 40
  const colWidth = 85
  const rowHeight = 8
  const margin = 20

  // Cabeçalho da tabela
  doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.rect(margin, yPos, colWidth, rowHeight, "F")
  doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

  doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
  doc.setFontSize(11)
  doc.text("Campo", margin + 5, yPos + 5.5)
  doc.text("Valor", margin + colWidth + 5, yPos + 5.5)

  yPos += rowHeight

  // Linhas da tabela
  const infoData = [
    ["Nome Completo", `${user.nome} ${user.sobrenome || ""}`],
    ["Email", user.email],
    ["Telefone", user.phone || "Não informado"],
    ["Data de Nascimento", user.birthDate || "Não informada"],
    ["Data de Cadastro", formatarData(user.createdAt)],
    ["Último Acesso", user.ultimoAcesso],
  ]

  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])

  infoData.forEach((row, index) => {
    // Alternar cores de fundo para melhor legibilidade
    if (index % 2 === 0) {
      doc.setFillColor(PDF_COLORS.lightGray[0], PDF_COLORS.lightGray[1], PDF_COLORS.lightGray[2])
    } else {
      doc.setFillColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
    }

    doc.rect(margin, yPos, colWidth, rowHeight, "F")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

    // Bordas da célula
    doc.setDrawColor(PDF_COLORS.border[0], PDF_COLORS.border[1], PDF_COLORS.border[2])
    doc.rect(margin, yPos, colWidth, rowHeight, "S")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "S")

    doc.text(row[0], margin + 5, yPos + 5.5)
    doc.text(row[1], margin + colWidth + 5, yPos + 5.5)

    yPos += rowHeight
  })

  // Desempenho
  yPos += 15
  doc.setFontSize(14)
  doc.text("Desempenho na Plataforma", 20, yPos)
  yPos += 10

  // Tabela de desempenho
  // Cabeçalho da tabela
  doc.setFillColor(PDF_COLORS.primary[0], PDF_COLORS.primary[1], PDF_COLORS.primary[2])
  doc.rect(margin, yPos, colWidth, rowHeight, "F")
  doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

  doc.setTextColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
  doc.text("Métrica", margin + 5, yPos + 5.5)
  doc.text("Valor", margin + colWidth + 5, yPos + 5.5)

  yPos += rowHeight
  doc.setTextColor(PDF_COLORS.text[0], PDF_COLORS.text[1], PDF_COLORS.text[2])

  // Dados de desempenho
  const desempenhoData = [
    ["Pontuação Total", user.points.toString()],
    ["Classificação", user.desempenho],
    ["Status", getStatusText(user.desempenho)],
  ]

  desempenhoData.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(PDF_COLORS.lightGray[0], PDF_COLORS.lightGray[1], PDF_COLORS.lightGray[2])
    } else {
      doc.setFillColor(PDF_COLORS.white[0], PDF_COLORS.white[1], PDF_COLORS.white[2])
    }

    doc.rect(margin, yPos, colWidth, rowHeight, "F")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "F")

    doc.setDrawColor(PDF_COLORS.border[0], PDF_COLORS.border[1], PDF_COLORS.border[2])
    doc.rect(margin, yPos, colWidth, rowHeight, "S")
    doc.rect(margin + colWidth, yPos, colWidth, rowHeight, "S")

    doc.text(row[0], margin + 5, yPos + 5.5)
    doc.text(row[1], margin + colWidth + 5, yPos + 5.5)

    yPos += rowHeight
  })

  // Recomendações
  yPos += 15
  doc.setFontSize(14)
  doc.text("Recomendações", 20, yPos)
  yPos += 7
  doc.setFontSize(11)

  const recomendacoes = getRecomendacoes(user.desempenho)

  // Quebrar o texto em múltiplas linhas
  const textLines = doc.splitTextToSize(recomendacoes, 170)
  doc.text(textLines, 20, yPos)

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(PDF_COLORS.footer[0], PDF_COLORS.footer[1], PDF_COLORS.footer[2])
    doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" })
    doc.text("© G7", 105, 290, { align: "center" })
  }

  // Salvar o PDF
  doc.save(`relatorio-${user.nome.toLowerCase()}-${user.id}.pdf`)
}

// Funções auxiliares
function formatarData(timestamp: number): string {
  if (!timestamp) return "Não informada"

  const data = new Date(timestamp)
  const dia = String(data.getDate()).padStart(2, "0")
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const ano = data.getFullYear()

  return `${dia}/${mes}/${ano}`
}

function getStatusText(desempenho: string): string {
  switch (desempenho) {
    case "Bom":
      return "Excelente progresso"
    case "Médio":
      return "Progresso satisfatório"
    case "Ruim":
      return "Necessita atenção"
    default:
      return "Não avaliado"
  }
}

function getRecomendacoes(desempenho: string): string {
  switch (desempenho) {
    case "Bom":
      return "O usuário está com ótimo desempenho. Recomenda-se desafios mais avançados e possivelmente atribuir papel de mentor para outros usuários."
    case "Médio":
      return "O usuário está progredindo bem. Recomenda-se revisar os conteúdos onde teve mais dificuldade e incentivar a participação em mais atividades interativas."
    case "Ruim":
      return "O usuário precisa de atenção especial. Recomenda-se uma revisão completa do material básico, acompanhamento personalizado e definição de metas de curto prazo."
    default:
      return "Não há recomendações disponíveis para este usuário."
  }
}
