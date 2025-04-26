"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Trash2, Upload, FileText, LinkIcon, ExternalLink } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Resource } from "@/lib/types"

export default function ResourcesSection() {
  const [resources, setResources] = useLocalStorage<Resource[]>("resources", [])
  const [newResourceName, setNewResourceName] = useState("")
  const [newResourceUrl, setNewResourceUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddLink = () => {
    if (newResourceName.trim() && newResourceUrl.trim()) {
      const newResource: Resource = {
        id: Date.now().toString(),
        name: newResourceName,
        url: newResourceUrl,
        type: "link",
        createdDate: new Date().toISOString(),
      }

      setResources([...resources, newResource])
      setNewResourceName("")
      setNewResourceUrl("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const newResource: Resource = {
              id: Date.now().toString(),
              name: file.name,
              url: event.target.result as string,
              type: "file",
              fileType: file.type,
              createdDate: new Date().toISOString(),
            }

            setResources((prev) => [...prev, newResource])
          }
        }
        reader.readAsDataURL(file)
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileIcon = (fileType = "") => {
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word") || fileType.includes("document")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    if (fileType.includes("video")) return "🎬"
    if (fileType.includes("audio")) return "🎵"
    return "📁"
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">Manage your learning resources and materials</p>
      </div>

      <Tabs defaultValue="upload" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="link">Add Links</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 transition-colors hover:border-orange-500 dark:hover:border-orange-500">
                <Upload className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-center text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                >
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Add Link</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                <Input
                  placeholder="Resource name"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                />
                <Input
                  placeholder="URL (https://...)"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                />
                <Button
                  onClick={handleAddLink}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Your Resources</h2>
        <p className="text-muted-foreground">
          {resources.length} {resources.length === 1 ? "resource" : "resources"} available
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources yet. Add some links or upload files to get started!</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map((resource) => (
            <motion.div key={resource.id} variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      {resource.type === "file" ? (
                        <div className="text-2xl mr-2">{getFileIcon(resource.fileType)}</div>
                      ) : (
                        <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
                      )}
                      <h3 className="font-medium truncate">{resource.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">Added on {formatDate(resource.createdDate)}</div>

                  <div className="mt-auto">
                    {resource.type === "link" ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        Visit Link
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <a
                        href={resource.url}
                        download={resource.name}
                        className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        Download File
                        <FileText className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
