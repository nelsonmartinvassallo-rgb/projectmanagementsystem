"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProject } from "@/app/actions/projects"
import { useState } from "react"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteProject(projectId)
    } catch (error) {
      console.error("[v0] Error deleting project:", error)
      alert("Error al eliminar el proyecto")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash className="h-4 w-4" />
    </Button>
  )
}
