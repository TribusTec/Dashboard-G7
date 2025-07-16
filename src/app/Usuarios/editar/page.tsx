"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ref, get, update } from "firebase/database"
import { database } from "@/services/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { CalendarIcon, CheckCircle2, Mail, Phone, Save, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {toast} from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/rotaSegura"

const avatarOptions = [
  { id: "1", source: "avatar1", image: "/avatars/avatar1.png" },
  { id: "2", source: "avatar2", image: "/avatars/avatar2.png" },
  { id: "3", source: "avatar3", image: "/avatars/avatar3.png" },
  { id: "4", source: "avatar4", image: "/avatars/avatar4.png" },
]

function EditarUsuarioContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formChanged, setFormChanged] = useState(false)

  useEffect(() => {
    if (!id) {
      router.push("/Usuarios")
      return
    }

    const fetchUser = async () => {
      try {
        const userRef = ref(database, `users/${id}`)
        const snapshot = await get(userRef)
        if (snapshot.exists()) {
          const userData = snapshot.val()
          setUser(userData)

          // Parse birthDate to Date object if it exists
          if (userData.birthDate) {
            const [day, month, year] = userData.birthDate.split("/")
            setDate(new Date(Number(year), Number(month) - 1, Number(day)))
          }
        }
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        toast.error("Erro: Não foi possível carregar os dados do usuário")
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, router])

  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value })
    setFormChanged(true)
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      const formattedDate = format(newDate, "dd/MM/yyyy")
      setUser({ ...user, birthDate: formattedDate })
      setFormChanged(true)
    }
  }

  const handleAvatarSelect = (avatarId: string, avatarSource: string) => {
    setUser({ ...user, avatarId, avatarSource })
    setFormChanged(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const userRef = ref(database, `users/${id}`)
      await update(userRef, {
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        phone: user.phone,
        avatarId: user.avatarId,
        avatarSource: user.avatarSource,
        birthDate: user.birthDate,
      })

      toast.success("Sucesso! Dados do usuário atualizados com sucesso")
      setFormChanged(false)
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      toast.error("Erro: Não foi possível atualizar os dados do usuário")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/Usuarios")
  }

  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase()
  }

  // Função para obter a imagem do avatar com base no ID
  const getAvatarImage = (avatarId: string) => {
    const avatar = avatarOptions.find((a) => a.id === avatarId)
    return avatar ? avatar.image : null
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Carregando dados do usuário...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Usuário não encontrado</CardTitle>
            <CardDescription>Não foi possível encontrar o usuário solicitado.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/Usuarios")} className="w-full">
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const createdAtDate = new Date(user.createdAt)
  const formattedCreatedAt = format(createdAtDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })

  // Obter a imagem do avatar atual do usuário
  const currentAvatarImage = getAvatarImage(user.avatarId)

  return (
    <>
      <Sidebar />
    <div className="p-4">
      <h1>Editar Usuário</h1>
      <main className="sm:ml-64 p-4">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4"></section>
        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Perfil de Usuário</h1>
              <p className="text-muted-foreground">Gerencie as informações do usuário</p>
            </div>
            <Badge variant="outline" className="gap-1 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
            </Badge>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="account">Conta e Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                    <CardDescription>Escolha um avatar para o usuário</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="h-32 w-32 border-4 border-background shadow-lg rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      {currentAvatarImage ? (
                        <Image
                          src={currentAvatarImage || "/placeholder.svg"}
                          alt={`Avatar de ${user.nome}`}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-2xl font-bold text-muted-foreground">
                          {getInitials(user.nome, user.sobrenome)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleAvatarSelect(avatar.id, avatar.source)}
                          className={cn(
                            "relative rounded-full p-1 transition-all",
                            user.avatarId === avatar.id
                              ? "ring-2 ring-primary ring-offset-2"
                              : "hover:ring-1 hover:ring-muted-foreground",
                          )}
                        >
                          <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                            <Image
                              src={avatar.image || "/placeholder.svg"}
                              alt={`Avatar ${avatar.id}`}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          </div>
                          {user.avatarId === avatar.id && (
                            <CheckCircle2 className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary text-primary-foreground" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Informações básicas do usuário</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                          id="nome"
                          value={user.nome || ""}
                          onChange={(e) => handleChange("nome", e.target.value)}
                          placeholder="Nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sobrenome">Sobrenome</Label>
                        <Input
                          id="sobrenome"
                          value={user.sobrenome || ""}
                          onChange={(e) => handleChange("sobrenome", e.target.value)}
                          placeholder="Sobrenome"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdAt">Membro desde</Label>
                      <div className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                        {formattedCreatedAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                    <CardDescription>Como entrar em contato com o usuário</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email || ""}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Telefone
                        </Label>
                        <Input
                          id="phone"
                          value={user.phone || ""}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+55 (00) 00000-0000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Conta e Segurança</CardTitle>
                  <CardDescription>Gerencie as configurações da conta do usuário</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uid">ID do Usuário</Label>
                    <div className="flex">
                      <Input id="uid" value={user.uid} readOnly className="rounded-r-none bg-muted" />
                      <Button
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={() => {
                          navigator.clipboard.writeText(user.uid)
                          toast.success("Copiado! ID do usuário copiado para a área de transferência")
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-500">
                    <h4 className="mb-2 font-medium">Ações de segurança</h4>
                    <p className="text-sm">
                      Opções adicionais de segurança como redefinição de senha e verificação de email estão disponíveis
                      no painel de administração.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex items-center justify-end space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={!formChanged || saving} variant='default' className="bg-marca hover:bg-marca/80 text-white">
                  {saving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar alterações</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja salvar as alterações feitas no perfil do usuário?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document
                        .querySelector('[role="dialog"]')
                        ?.closest("div")
                        ?.dispatchEvent(new Event("close", { bubbles: true }))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                  className="text-white"
                    onClick={() => {
                      handleSave()
                      document
                        .querySelector('[role="dialog"]')
                        ?.closest("div")
                        ?.dispatchEvent(new Event("close", { bubbles: true }))
                    }}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

export default function EditarUsuarioPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <EditarUsuarioContent />
    </ProtectedRoute>
  )
}
