"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Search, ImageIcon, Check, Upload, Plus } from "lucide-react"
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytesResumable } from "firebase/storage"
import { toast } from "sonner"
import app from "@/services/firebase"

interface FileItem {
  id: string
  name: string
  url: string
  category: string
  size: number
  uploadedAt: Date
  type: string
}

interface ImageSelectorProps {
  selectedImageUrl?: string
  onImageSelect: (url: string) => void
  buttonText?: string
  placeholder?: string
}

const CATEGORIES = [
  { value: "trilhas", label: "Trilhas" },
  { value: "etapas", label: "Etapas" },
  { value: "modais", label: "Modais" },
  { value: "outros", label: "Outros" },
]

export function ImageSelector({
  selectedImageUrl = "",
  onImageSelect,
  buttonText = "Selecionar da Galeria",
  placeholder = "Nenhuma imagem selecionada",
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [images, setImages] = useState<FileItem[]>([])
  const [filteredImages, setFilteredImages] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadCategory, setUploadCategory] = useState("")

  const storage = getStorage(app)

  useEffect(() => {
    if (isOpen && images.length === 0) {
      loadImages()
    }
  }, [isOpen])

  useEffect(() => {
    filterImages()
  }, [images, searchTerm, selectedCategory])

  const loadImages = async () => {

    try {
      setLoading(true)
      const allImages: FileItem[] = []

      for (const category of CATEGORIES) {

        const categoryRef = ref(storage, category.value)
        try {
          const result = await listAll(categoryRef)


          for (const itemRef of result.items) {
            try {
    
              const url = await getDownloadURL(itemRef)
              const metadata = await getMetadata(itemRef)

          

              // Apenas imagens
              if (metadata.contentType?.startsWith("image/")) {
                allImages.push({
                  id: itemRef.fullPath,
                  name: itemRef.name,
                  url,
                  category: category.value,
                  size: metadata.size || 0,
                  uploadedAt: new Date(metadata.timeCreated || Date.now()),
                  type: metadata.contentType || "unknown",
                })
               
              } else {
                console.log(`Arquivo ignorado (não é imagem): ${itemRef.name}, tipo: ${metadata.contentType}`)
              }
            } catch (fileError) {
              console.error(`Erro ao processar arquivo ${itemRef.name}:`, fileError)
            }
          }
        } catch (categoryError) {
          console.log(`Categoria ${category.value} não encontrada ou vazia:`, categoryError)
        }
      }

  
      setImages(allImages.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
    } catch (error) {
      console.error("Erro ao carregar imagens:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterImages = () => {
    let filtered = images

    if (selectedCategory !== "todos") {
      filtered = filtered.filter((image) => image.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter((image) => image.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredImages(filtered)
  }

  const handleImageSelect = (url: string) => {
   
    onImageSelect(url)
    setIsOpen(false)
  }

  const handleFileUpload = async (file: File, category: string) => {
    try {
      setUploading(true)
      setUploadProgress(0)


      if (!file.type.startsWith("image/")) {
        toast.error("Apenas imagens são permitidas")
        setUploading(false)
        return
      }

    
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.")
        setUploading(false)
        return
      }

      
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
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

            setImages((prev) => [newFile, ...prev])
            toast.success("Arquivo enviado com sucesso!")
            setIsUploadOpen(false)
            setSelectedFile(null)
            setUploadCategory("")
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !uploadCategory) {
      toast.error("Selecione um arquivo e uma categoria")
      return
    }

    await handleFileUpload(selectedFile, uploadCategory)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 ">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="default" className="flex-shrink-0 bg-marca" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              {buttonText}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">Galeria de Imagens</DialogTitle>
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
               
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Fazer Upload de Imagem</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="upload-file" className="block text-sm font-medium mb-2">
                          Arquivo
                        </Label>
                        <Input
                          id="upload-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          disabled={uploading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="upload-category" className="block text-sm font-medium mb-2">
                          Categoria
                        </Label>
                        <Select value={uploadCategory} onValueChange={setUploadCategory} disabled={uploading}>
                          <SelectTrigger id="upload-category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Enviando...</span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsUploadOpen(false)}
                          disabled={uploading}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={!selectedFile || !uploadCategory || uploading}
                        >
                          {uploading ? "Enviando..." : "Fazer Upload"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogHeader>

            <div className="flex-1 flex flex-col space-y-4 min-h-0">
              <div className="flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar imagens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as categorias</SelectItem>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                  </div>
                       <Button 
                      type="button" 
                      variant="default" 
                        onClick={() => setIsUploadOpen(true)}
                      size="sm" 
                      className="bg-marca hover:bg-marca/90 py-5"
                    >
                      <Upload className="w-4 h-4 " />
                     
                    </Button>
                </div>
              </div>

   
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm || selectedCategory !== "todos"
                          ?  `Nenhuma imagem encontrada  na categoria "${selectedCategory}"`
                          : "Faça upload de imagens na seção Arquivos"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                    {filteredImages.map((image) => (
                      <Card
                        key={image.id}
                        className={`cursor-pointer t  ${
                          selectedImageUrl === image.url ? "border-marca border-2" : ""
                        }`}
                        onClick={() => handleImageSelect(image.url)}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          {selectedImageUrl === image.url && (
                            <div className="absolute top-2 right-2 bg-marca text-white rounded-full p-1 shadow-lg">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
                            <Badge variant="secondary" className="text-xs">
                              {CATEGORIES.find((c) => c.value === image.category)?.label}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            <h4 className="font-medium text-xs truncate" title={image.name}>
                              {truncateText(image.name, 15)}
                            </h4>
                            <span className="text-xs text-muted-foreground">{formatFileSize(image.size)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview da imagem selecionada */}
      {selectedImageUrl && (
        <div className="mt-2">
          <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
            <img
              src={selectedImageUrl || "/placeholder.svg"}
              alt="Imagem selecionada"
              className="w-10 h-10 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Imagem selecionada</p>
              <p className="text-xs text-muted-foreground truncate">{truncateText(selectedImageUrl, 30)}</p>
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => onImageSelect("")}>
              Remover
            </Button>
          </div>
        </div>
      )}

      {!selectedImageUrl && <p className="text-sm text-muted-foreground">{placeholder}</p>}
    </div>
  )
}
