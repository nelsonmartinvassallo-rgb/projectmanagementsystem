import { Skeleton } from "@/components/ui/skeleton"
import { DashboardNav } from "@/components/dashboard-nav"

export default function CalendarLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </main>
      </div>
    </div>
  )
}
