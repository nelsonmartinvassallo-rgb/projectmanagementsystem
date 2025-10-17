import Link from "next/link"
import { BarChart3, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { getProjects } from "@/app/actions/projects"
import { DeleteProjectButton } from "@/components/delete-project-button"

export default async function ProjectsPage() {
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
            <Link href="/projects" className="text-sm font-medium text-primary">
              Proyectos
            </Link>
            <Link href="/tasks" className="text-sm font-medium transition-colors hover:text-primary">
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
            <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
            <div className="flex items-center gap-2">
              <Link href="/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar proyectos..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Fin</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{project.description || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "active"
                            ? "default"
                            : project.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status === "active"
                          ? "Activo"
                          : project.status === "completed"
                            ? "Completado"
                            : "Archivado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.priority === "high"
                            ? "destructive"
                            : project.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <DeleteProjectButton projectId={project.id} />
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No tienes proyectos aún. Crea tu primer proyecto para comenzar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
