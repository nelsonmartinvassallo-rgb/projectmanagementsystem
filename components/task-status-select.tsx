"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTaskStatus } from "@/app/actions/tasks"
import { useState } from "react"

interface TaskStatusSelectProps {
  taskId: string
  currentStatus: "todo" | "in-progress" | "review" | "done"
}

export function TaskStatusSelect({ taskId, currentStatus }: TaskStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: "todo" | "in-progress" | "review" | "done") => {
    setIsUpdating(true)
    setStatus(newStatus)
    try {
      await updateTaskStatus(taskId, newStatus)
    } catch (error) {
      console.error("[v0] Error updating task status:", error)
      setStatus(currentStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Por hacer"
      case "in-progress":
        return "En progreso"
      case "review":
        return "En revisión"
      case "done":
        return "Completada"
      default:
        return status
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>{getStatusLabel(status)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">Por hacer</SelectItem>
        <SelectItem value="in-progress">En progreso</SelectItem>
        <SelectItem value="review">En revisión</SelectItem>
        <SelectItem value="done">Completada</SelectItem>
      </SelectContent>
    </Select>
  )
}
