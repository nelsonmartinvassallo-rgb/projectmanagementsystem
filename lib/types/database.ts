export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: "active" | "completed" | "archived"
          priority: "low" | "medium" | "high"
          start_date: string | null
          end_date: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: "active" | "completed" | "archived"
          priority?: "low" | "medium" | "high"
          start_date?: string | null
          end_date?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: "active" | "completed" | "archived"
          priority?: "low" | "medium" | "high"
          start_date?: string | null
          end_date?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "todo" | "in-progress" | "review" | "done"
          priority: "low" | "medium" | "high"
          project_id: string | null
          assigned_to: string | null
          created_by: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "todo" | "in-progress" | "review" | "done"
          priority?: "low" | "medium" | "high"
          project_id?: string | null
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: "todo" | "in-progress" | "review" | "done"
          priority?: "low" | "medium" | "high"
          project_id?: string | null
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: "owner" | "admin" | "member"
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: "owner" | "admin" | "member"
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: "owner" | "admin" | "member"
          created_at?: string
        }
      }
    }
  }
}
