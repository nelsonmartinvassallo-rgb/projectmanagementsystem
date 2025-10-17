"use client"
import Link from "next/link"
import { BarChart3, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { createTask } from "@/app/actions/tasks"
import { getProjects } from "@/app/actions/projects"

export default async function NewTaskPage() {
  const projects = await getProjects()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span>ProjectPro</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/projects" className="text-sm font-medium transition-colors hover:text-primary">
              Proyectos
            </Link>
            <Link href="/tasks" className="text-sm font-medium text-primary">
              Tareas
            </Link>
          </nav>
          <UserNav />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Nueva Tarea</h1>
            <div className="flex items-center gap-2">
              <Link href="/tasks">
                <Button variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <form action={createTask}>
              <CardHeader>
                <CardTitle>Información de la Tarea</CardTitle>
                <CardDescription>Ingresa los detalles de la nueva tarea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título de la Tarea</Label>
                  <Input id="title" name="title" placeholder="Ingresa el título de la tarea" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" placeholder="Describe la tarea" rows={4} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projectId">Proyecto (opcional)</Label>
                  <Select name="projectId">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Fecha de Vencimiento (opcional)</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button type="submit">Crear Tarea</Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}
