import Link from "next/link"
import { BarChart3, Calendar, CheckSquare, Clock, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { RecentActivity } from "@/components/recent-activity"
import { getProjects } from "@/app/actions/projects"
import { getTasks } from "@/app/actions/tasks"
import { getCurrentProfile } from "@/lib/auth/get-user"
import { DashboardStats } from "@/components/dashboard-stats"

export default async function DashboardPage() {
  const profile = await getCurrentProfile()
  const projects = await getProjects()
  const tasks = await getTasks()

  const activeProjects = projects.filter((p) => p.status === "active")
  const pendingTasks = tasks.filter((t) => t.status === "todo" || t.status === "in-progress")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span>ProjectPro</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/projects" className="text-sm font-medium transition-colors hover:text-primary">
              Proyectos
            </Link>
            <Link href="/tasks" className="text-sm font-medium transition-colors hover:text-primary">
              Tareas
            </Link>
            <Link href="/team" className="text-sm font-medium transition-colors hover:text-primary">
              Equipo
            </Link>
            <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
              Recursos
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Link href="/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </Link>
            </div>
          </div>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeProjects.length}</div>
                    <p className="text-xs text-muted-foreground">Total de proyectos en curso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingTasks.length}</div>
                    <p className="text-xs text-muted-foreground">Tareas por completar</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">Todos los proyectos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tasks.length}</div>
                    <p className="text-xs text-muted-foreground">Todas las tareas</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Proyectos Recientes</CardTitle>
                    <CardDescription>Tus proyectos más recientes</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {projects.slice(0, 3).map((project) => {
                      const projectTasks = tasks.filter((t) => t.project_id === project.id)
                      const completedTasks = projectTasks.filter((t) => t.status === "done")
                      const progress =
                        projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0

                      return (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                          <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">{progress}%</div>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {completedTasks.length}/{projectTasks.length} tareas
                              </span>
                              {project.end_date && (
                                <span>Vence: {new Date(project.end_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                    {projects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No tienes proyectos aún</p>
                        <Link href="/projects/new">
                          <Button className="mt-4" size="sm">
                            Crear tu primer proyecto
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas actualizaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <DashboardStats projects={projects} tasks={tasks} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
