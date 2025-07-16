import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { NoSSR } from "@/components/NoSSR"
import { AuthProvider } from "@/context/authContext"
import { ThemeProvider } from "@/components/Theme"
import { Toaster } from "sonner"

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "G7Med – Inovação em Saúde e Educação",
  description:
    "A G7Med é uma startup que transforma a saúde por meio da educação de qualidade. Conectamos médicos, profissionais da saúde e pacientes com conhecimento e inovação.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "G7Med – Educação e Inovação para a Nova Saúde",
    description:
      "Na G7Med, acreditamos que a saúde começa com conhecimento. Por isso, desenvolvemos soluções que unem tecnologia e educação para capacitar médicos, profissionais da saúde e pacientes em toda a jornada do cuidado.",
    url: "https://dashboard.g7med.educagame.com.br", 
    siteName: "G7Med",
    images: [
      {
        url: "/meta.jpg", 
        width: 1200,
        height: 630,
        alt: "G7Med – Inovação em Saúde e Educação",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={dmSans.className}>
        <NoSSR
          fallback={
            <div className="flex h-screen items-center justify-center bg-background">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            </div>
          }
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
          <Toaster position="top-right" richColors  />
        </NoSSR>
      </body>
    </html>
  )
}
