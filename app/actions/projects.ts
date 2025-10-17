"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/types/database"

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export async function createProject(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as "low" | "medium" | "high"
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string

  const projectData: ProjectInsert = {
    name,
    description: description || null,
    priority: priority || "medium",
    start_date: startDate || null,
    end_date: endDate || null,
    owner_id: user.id,
    status: "active",
  }

  const { data, error } = await supabase.from("projects").insert(projectData).select().single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/projects")
  redirect("/projects")
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as "low" | "medium" | "high"
  const status = formData.get("status") as "active" | "completed" | "archived"
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string

  const projectData: ProjectUpdate = {
    name,
    description: description || null,
    priority: priority || "medium",
    status: status || "active",
    start_date: startDate || null,
    end_date: endDate || null,
  }

  const { error } = await supabase.from("projects").update(projectData).eq("id", projectId).eq("owner_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/projects")
  revalidatePath(`/projects/${projectId}`)
}

export async function deleteProject(projectId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("owner_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/projects")
  redirect("/projects")
}

export async function getProjects() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      profiles:owner_id (
        id,
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function getProject(projectId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      profiles:owner_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("id", projectId)
    .single()

  if (error) {
    console.error("[v0] Error fetching project:", error)
    return null
  }

  return data
}
