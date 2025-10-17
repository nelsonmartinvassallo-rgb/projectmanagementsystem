"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/types/database"

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"]

export async function createTask(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as "low" | "medium" | "high"
  const projectId = formData.get("projectId") as string
  const dueDate = formData.get("dueDate") as string
  const assignedTo = formData.get("assignedTo") as string

  const taskData: TaskInsert = {
    title,
    description: description || null,
    priority: priority || "medium",
    project_id: projectId || null,
    due_date: dueDate || null,
    assigned_to: assignedTo || null,
    created_by: user.id,
    status: "todo",
  }

  const { data, error } = await supabase.from("tasks").insert(taskData).select().single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/tasks")
  if (projectId) {
    revalidatePath(`/projects/${projectId}`)
  }

  return data
}

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as "low" | "medium" | "high"
  const status = formData.get("status") as "todo" | "in-progress" | "review" | "done"
  const projectId = formData.get("projectId") as string
  const dueDate = formData.get("dueDate") as string
  const assignedTo = formData.get("assignedTo") as string

  const taskData: TaskUpdate = {
    title,
    description: description || null,
    priority: priority || "medium",
    status: status || "todo",
    project_id: projectId || null,
    due_date: dueDate || null,
    assigned_to: assignedTo || null,
  }

  const { error } = await supabase.from("tasks").update(taskData).eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/tasks")
  if (projectId) {
    revalidatePath(`/projects/${projectId}`)
  }
}

export async function updateTaskStatus(taskId: string, status: "todo" | "in-progress" | "review" | "done") {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/tasks")
}

export async function deleteTask(taskId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("created_by", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/tasks")
}

export async function getTasks(projectId?: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  let query = supabase
    .from("tasks")
    .select(
      `
      *,
      project:project_id (
        id,
        name
      ),
      assigned:assigned_to (
        id,
        full_name,
        email
      ),
      creator:created_by (
        id,
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching tasks:", error)
    return []
  }

  return data || []
}

export async function getTask(taskId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      project:project_id (
        id,
        name
      ),
      assigned:assigned_to (
        id,
        full_name,
        email
      ),
      creator:created_by (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("id", taskId)
    .single()

  if (error) {
    console.error("[v0] Error fetching task:", error)
    return null
  }

  return data
}
