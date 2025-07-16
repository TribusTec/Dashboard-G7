"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Upload,
  Trash2,
  Download,
  Search,
  Grid3X3,
  List,
  Copy,
  Eye,
  FolderOpen,
  MapIcon,
  FlagIcon,
  SquareIcon,
  FolderIcon,
} from "lucide-react"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage"
import app from "@/services/firebase"
import { Sidebar } from "@/components/sidebar"
// import { LoadingTransition } from "@/components/loading"

interface FileItem {
  id: string
  name: string
  url: string
  category: string
  size: number
  uploadedAt: Date
  type: string
}

const CATEGORIES = [
  { value: "trilhas", label: "Trilhas", icon: MapIcon },
  { value: "etapas", label: "Etapas", icon: FlagIcon },
  { value: "modais", label: "Modais", icon: SquareIcon },
  { value: "outros", label: "Outros", icon: FolderIcon },
]

export default function ArquivosPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const storage = getStorage(app)

  // Carregar arquivos quando o componente for montado
  useEffect(() => {
    loadFiles()
  }, [])

  useEffect(() => {
    filterFiles()
  }, [files, searchTerm, selectedCategory])

  const loadFiles = async () => {
   
    try {
      setLoading(true)
      const allFiles: FileItem[] = []

      for (const category of CATEGORIES) {
        const categoryRef = ref(storage, category.value)
        try {
      
          const result = await listAll(categoryRef)
       

          for (const itemRef of result.items) {
            try {
              const url = await getDownloadURL(itemRef)
              const metadata = await getMetadata(itemRef)

              allFiles.push({
                id: itemRef.fullPath,
                name: itemRef.name,
                url,
                category: category.value,
                size: metadata.size || 0,
                uploadedAt: new Date(metadata.timeCreated || Date.now()),
                type: metadata.contentType || "unknown",
              })
            } catch (fileError) {
              console.error(`Erro ao processar arquivo ${itemRef.name}:`, fileError)
            }
          }
        } catch (categoryError) {
          console.log(`Categoria ${category.value} não encontrada ou vazia`)
        }
      }

      
      setFiles(allFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error)
      toast.error("Erro ao carregar arquivos")
    } finally {
     
      setLoading(false)
    }
  }

  const filterFiles = () => {
    let filtered = files

    if (selectedCategory !== "todos") {
      filtered = filtered.filter((file) => file.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredFiles(filtered)
  }

  const handleFileUpload = async (file: File, category: string) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Apenas imagens são permitidas")
        setUploading(false)
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.")
        setUploading(false)
        return
      }

      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      // const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const storageRef = ref(storage, `${category}/${fileName}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error("Erro no upload:", error)
          toast.error(`Erro ao fazer upload: ${error.message}`)
          setUploading(false)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            const metadata = uploadTask.snapshot.metadata

            const newFile: FileItem = {
              id: uploadTask.snapshot.ref.fullPath,
              name: fileName,
              url: downloadURL,
              category,
              size: metadata.size || 0,
              uploadedAt: new Date(),
              type: metadata.contentType || "unknown",
            }

            setFiles((prev) => [newFile, ...prev])
            toast.success("Arquivo enviado com sucesso!")
          } catch (error) {
            console.error("Erro ao obter URL:", error)
            toast.error("Erro ao finalizar upload")
          } finally {
            setUploading(false)
            setUploadProgress(0)
          }
        },
      )
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast.error("Erro ao fazer upload do arquivo")
      setUploading(false)
    }
  }

  const handleDeleteFile = async (file: FileItem) => {
    try {
      const fileRef = ref(storage, file.id)
      await deleteObject(fileRef)

      setFiles((prev) => prev.filter((f) => f.id !== file.id))
      toast.success("Arquivo deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error)
      toast.error("Erro ao deletar arquivo")
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copiada para a área de transferência!")
  }

  const getCategoryStats = () => {
    const stats = CATEGORIES.map((category) => ({
      ...category,
      count: files.filter((file) => file.category === category.value).length,
      size: files.filter((file) => file.category === category.value).reduce((total, file) => total + file.size, 0),
    }))
    return stats
  }

  return (
    <>
      <Sidebar />
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl sm:ml-64">
        <div className="flex flex-col">
          {/* <LoadingTransition isLoading={loading} /> */}

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Gerenciador de Arquivos</h1>
                <p className="text-muted-foreground">Gerencie suas imagens e arquivos organizados por categoria</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fazer Upload de Arquivo</DialogTitle>
                  </DialogHeader>
                  <UploadForm onUpload={handleFileUpload} uploading={uploading} progress={uploadProgress} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getCategoryStats().map((stat) => (
                <Card key={stat.value} className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">
                      <stat.icon className="w-6 h-6 mx-auto text-marca" />
                    </div>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatFileSize(stat.size)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar arquivos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as categorias</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon size={12} className="text-marca" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 size={12} />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files Grid/List */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    : "space-y-2"
                }
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonCard key={index} viewMode={viewMode} />
                ))}
              </div>
            ) : filteredFiles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum arquivo encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== "todos"
                      ? "Tente ajustar os filtros de busca"
                      : "Faça upload do seu primeiro arquivo para começar"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    onDelete={() => handleDeleteFile(file)}
                    onCopy={() => copyToClipboard(file.url)}
                    onView={() => setSelectedFile(file)}
                  />
                ))}
              </div>
            )}

            {/* File Preview Dialog */}
            <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{selectedFile?.name}</DialogTitle>
                </DialogHeader>
                {selectedFile && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={selectedFile.url || "/placeholder.svg"}
                        alt={selectedFile.name}
                        className="max-h-96 object-contain rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Categoria:</strong> {CATEGORIES.find((c) => c.value === selectedFile.category)?.label}
                      </div>
                      <div>
                        <strong>Tamanho:</strong> {formatFileSize(selectedFile.size)}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {selectedFile.type}
                      </div>
                      <div>
                        <strong>Upload:</strong> {selectedFile.uploadedAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(selectedFile.url)} className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar URL
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedFile.url, "_blank")}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </>
  )
}

// Componente para upload de arquivos
function UploadForm({
  onUpload,
  uploading,
  progress,
}: {
  onUpload: (file: File, category: string) => void
  uploading: boolean
  progress: number
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFile && selectedCategory) {
      onUpload(selectedFile, selectedCategory)
      setSelectedFile(null)
      setSelectedCategory("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Arquivo</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Categoria</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={uploading}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <category.icon size={12} />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Enviando...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      <Button type="submit" disabled={!selectedFile || !selectedCategory || uploading} className="w-full">
        {uploading ? "Enviando..." : "Fazer Upload"}
      </Button>
    </form>
  )
}

// Componente para exibir cada arquivo
function FileCard({
  file,
  viewMode,
  onDelete,
  onCopy,
  onView,
}: {
  file: FileItem
  viewMode: "grid" | "list"
  onDelete: () => void
  onCopy: () => void
  onView: () => void
}) {
  const category = CATEGORIES.find((c) => c.value === file.category)

  if (viewMode === "list") {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-12 h-12 object-cover rounded" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{file.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">
                <div className="flex items-center gap-1">
                  {category?.icon && <category.icon className="w-3 h-3" />}
                  {category?.label}
                </div>
              </Badge>
              <span>{formatFileSize(file.size)}</span>
              <span>{file.uploadedAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onView}>
              <Eye size={12} />
            </Button>
            <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600" onClick={onCopy}>
              <Copy size={12} />
            </Button>
            <Button size="sm" variant="destructive" className="" onClick={onDelete}>
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={onView}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={onView}>
            <Eye size={12} />
          </Button>
          <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600" onClick={onCopy}>
            <Copy size={12} />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-medium text-sm truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <div className="flex items-center gap-1">
                {category?.icon && <category.icon className="w-3 h-3" />}
                {category?.label}
              </div>
            </Badge>
            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}


function SkeletonCard({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="flex items-center gap-4">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
