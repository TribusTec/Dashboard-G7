"use client"

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/authContext"
import { useState } from "react"
import {
  Menu,
  LayoutDashboardIcon,
  MonitorIcon as MonitorCog,
  Users,
  Trophy,
  Sun,
  Moon,
  LogOut,
  Activity,
  Shield,
  MoreHorizontal,
  GraduationCap,
  Folders,
  Settings,
  ChevronDown,
  Smartphone,
  Monitor,
} from "lucide-react"
import Logo from "@/assets/logo.svg"
import LogoD from "@/assets/logoD.svg"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NavItem } from "@/components/navItem/page"
import { ConfirmDialog as ModalConfirm } from "@/components/ModalConfirm"
import { HydrationBoundary } from "@/components/HydrationBoundary"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const appVersion = "1.8"

  const isActive = (href: string) => {
    if (!pathname) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isConfigActive = () => {
    return pathname?.startsWith("/Configuracoes") || false
  }

  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name.charAt(0).toUpperCase()
  }

  const ConfigSection = () => (
    <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={`flex w-full items-center gap-2 relative transition-colors text-muted-foreground hover:text-marca ${
            isConfigActive()
              ? "font-bold text-marca before:w-1 before:h-full before:bg-marca before:absolute before:-right-6 before:top-0"
              : ""
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isConfigOpen ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-7 mt-2 space-y-2">
        <Link
          href="/Configuracoes/app"
          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors hover:bg-muted ${
            pathname === "/Configuracoes/app" ? "bg-muted text-marca font-medium" : "text-muted-foreground"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          App
        </Link>
        <Link
          href="/Configuracoes/dashboard"
          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors hover:bg-muted ${
            pathname === "/Configuracoes/dashboard" ? "bg-muted text-marca font-medium" : "text-muted-foreground"
          }`}
        >
          <Monitor className="h-4 w-4" />
          Dashboard
        </Link>
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <div className="flex w-full flex-col bg-muted">
      <aside className="fixed inset-y-0 z-10 hidden w-60 border-r bg-background sm:flex flex-col shadow-sm">
        <div className="p-5 border-b border-border">
          <Link href="#" className="block">
            <div className="relative group">
              <img
                className="w-36 mx-auto transition-all duration-300 group-hover:scale-105 "
                src={theme === "dark" ? LogoD?.src : Logo?.src}
                alt="Logotipo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=40&width=120"
                }}
              />
            </div>
          </Link>
        </div>

        <nav className="flex flex-col items-start gap-8 px-6 py-5 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Dashboard"
                    icon={<LayoutDashboardIcon className="h-5 w-5" />}
                    label="Dashboard"
                    isActive={isActive("/Dashboard")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Painel"
                    icon={<MonitorCog className="h-5 w-5" />}
                    label="Painel"
                    isActive={isActive("/Painel")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Painel</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Usuarios"
                    icon={<Users className="h-5 w-5" />}
                    label="Usuarios"
                    isActive={isActive("/Usuarios")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Usuarios</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Ranking"
                    icon={<Trophy className="h-5 w-5" />}
                    label="Ranking"
                    isActive={isActive("/Ranking")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Ranking</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Comparacao"
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Aprendizado"
                    isActive={isActive("/Comparacao")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Aprendizado</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <NavItem
                    href="/Arquivos"
                    icon={<Folders className="h-5 w-5" />}
                    label="Arquivos"
                    isActive={isActive("/Arquivos")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Arquivos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <ConfigSection />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <div className="mt-auto border-t border-border bg-background">
          <div className="px-3 py-2 text-center border-b border-border">
            <div className="flex items-center justify-center gap-1.5 text-xs">
              <Activity className="h-3 w-3 text-marca" />
              <span className="text-muted-foreground">Versão:</span>
              <span className="text-marca font-medium">{appVersion}</span>
            </div>
          </div>

          <div className="p-3">
            {user?.name ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-marca/10 flex items-center justify-center text-marca font-medium text-xs">
                      {getUserInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-foreground capitalize truncate">{user.name}</p>
                      <div className="flex items-center gap-1">
                        <Shield className="h-2.5 w-2.5 text-marca" />
                        <span className="text-xs text-muted-foreground">Administrador</span>
                      </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
                    className="cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Modo Claro
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Modo Escuro
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ModalConfirm
                    trigger={
                      <button className="w-full flex items-center px-2 py-1.5 text-sm rounded-sm text-red-600 hover:bg-muted focus:bg-muted outline-none cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair da conta
                      </button>
                    }
                    title="Sair da conta"
                    description="Você tem certeza de que deseja sair da conta?"
                    onConfirm={logout}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3.5 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-2.5 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header + Sheet Menu */}
      <div className="sm:hidden flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center px-4 border-b border-border bg-background shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir / Fechar Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 bg-background">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <img
                    src={theme === "dark" ? LogoD?.src : Logo?.src}
                    className="w-24 mx-auto transition-all duration-300 "
                    alt="Logotipo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=40&width=120"
                    }}
                  />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="space-y-8">
                    <NavItem
                      href="/Dashboard"
                      icon={<LayoutDashboardIcon className="h-5 w-5" />}
                      label="Dashboard"
                      isActive={isActive("/Dashboard")}
                    />

                    <NavItem
                      href="/Painel"
                      icon={<MonitorCog className="h-5 w-5" />}
                      label="Painel"
                      isActive={isActive("/Painel")}
                    />

                    <NavItem
                      href="/Usuarios"
                      icon={<Users className="h-5 w-5" />}
                      label="Usuarios"
                      isActive={isActive("/Usuarios")}
                    />

                    <NavItem
                      href="/Ranking"
                      icon={<Trophy className="h-5 w-5" />}
                      label="Ranking"
                      isActive={isActive("/Ranking")}
                    />

                    <NavItem
                      href="/Comparacao"
                      icon={<GraduationCap className="h-5 w-5" />}
                      label="Aprendizado"
                      isActive={isActive("/Comparacao")}
                    />

                    <NavItem
                      href="/Arquivos"
                      icon={<Folders className="h-5 w-5" />}
                      label="Arquivos"
                      isActive={isActive("/Arquivos")}
                    />

                    <div className="w-full">
                      <ConfigSection />
                    </div>
                  </div>
                </div>

                {/* Footer Mobile */}
                <div className="border-t border-border bg-background">
                  <div className="px-3 py-2 text-center border-b border-border">
                    <div className="flex items-center justify-center gap-1.5 text-xs">
                      <Activity className="h-3 w-3 text-marca" />
                      <span className="text-muted-foreground">Versão:</span>
                      <span className="text-marca font-medium">{appVersion}</span>
                    </div>
                  </div>

                  <div className="p-3">
                    {user?.name ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-marca/10 flex items-center justify-center text-marca font-medium text-xs">
                              {getUserInitials(user.name)}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-sm font-medium text-foreground capitalize truncate">{user.name}</p>
                              <div className="flex items-center gap-1">
                                <Shield className="h-2.5 w-2.5 text-marca" />
                                <span className="text-xs text-muted-foreground">Administrador</span>
                              </div>
                            </div>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
                            className="cursor-pointer"
                          >
                            {theme === "dark" ? (
                              <>
                                <Sun className="mr-2 h-4 w-4" />
                                Modo Claro
                              </>
                            ) : (
                              <>
                                <Moon className="mr-2 h-4 w-4" />
                                Modo Escuro
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <ModalConfirm
                            trigger={
                              <button className="w-full flex items-center px-2 py-1.5 text-sm rounded-sm text-red-600 hover:bg-muted focus:bg-muted outline-none cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair da conta
                              </button>
                            }
                            title="Sair da conta"
                            description="Você tem certeza de que deseja sair da conta?"
                            onConfirm={logout}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex items-center gap-3 p-2">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3.5 bg-muted rounded animate-pulse mb-1"></div>
                          <div className="h-2.5 bg-muted rounded animate-pulse w-2/3"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 text-center">
            <Link href="#">
              <img
                src={theme === "dark" ? LogoD?.src : Logo?.src}
                className="w-24 mx-auto transition-all duration-300 "
                alt="Logotipo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=40&width=120"
                }}
              />
            </Link>
          </div>

          {/* Mobile Theme Toggle */}
          <HydrationBoundary
            fallback={
              <div className="w-10 h-10 bg-muted rounded ml-2 flex items-center justify-center">
                <Moon className="h-5 w-5 text-muted-foreground" />
              </div>
            }
          >
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </HydrationBoundary>
        </header>
      </div>
    </div>
  )
}
