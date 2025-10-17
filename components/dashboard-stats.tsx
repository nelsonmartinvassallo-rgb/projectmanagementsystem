import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DashboardStatsProps {
  projects: any[]
  tasks: any[]
}

export function DashboardStats({ projects, tasks }: DashboardStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento del Proyecto</CardTitle>
        <CardDescription>Progreso de tus proyectos activos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.slice(0, 5).map((project) => {
          const projectTasks = tasks.filter((t) => t.project_id === project.id)
          const completedTasks = projectTasks.filter((t) => t.status === "done")
          const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0

          return (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{project.name}</div>
                <div className="text-sm text-muted-foreground">{progress}%</div>
              </div>
              <Progress value={progress} />
            </div>
          )
        })}
        {projects.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">No hay proyectos para mostrar</div>
        )}
      </CardContent>
    </Card>
  )
}
