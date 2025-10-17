"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTask } from "@/app/actions/tasks"
import { useState } from "react"

export function DeleteTaskButton({ taskId }: { taskId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
      alert("Error al eliminar la tarea")
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
