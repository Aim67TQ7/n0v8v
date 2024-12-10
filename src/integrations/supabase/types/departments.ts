import { Json } from './auth';

export interface DepartmentTypes {
  Tables: {
    departments: {
      Row: {
        burden_rate: number | null
        company_id: string | null
        created_at: string
        id: string
        labor_rate: number | null
        leader_id: string | null
        location: string
        name: string
        primary_purpose: string | null
      }
      Insert: {
        burden_rate?: number | null
        company_id?: string | null
        created_at?: string
        id?: string
        labor_rate?: number | null
        leader_id?: string | null
        location: string
        name: string
        primary_purpose?: string | null
      }
      Update: {
        burden_rate?: number | null
        company_id?: string | null
        created_at?: string
        id?: string
        labor_rate?: number | null
        leader_id?: string | null
        location?: string
        name?: string
        primary_purpose?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "departments_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: false
          referencedRelation: "companies"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "departments_leader_id_fkey"
          columns: ["leader_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }
      ]
    }
    department_members: {
      Row: {
        created_at: string
        department_id: string | null
        id: string
        photo_url: string | null
        profile_id: string | null
      }
      Insert: {
        created_at?: string
        department_id?: string | null
        id?: string
        photo_url?: string | null
        profile_id?: string | null
      }
      Update: {
        created_at?: string
        department_id?: string | null
        id?: string
        photo_url?: string | null
        profile_id?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "department_members_department_id_fkey"
          columns: ["department_id"]
          isOneToOne: false
          referencedRelation: "departments"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "department_members_profile_id_fkey"
          columns: ["profile_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}