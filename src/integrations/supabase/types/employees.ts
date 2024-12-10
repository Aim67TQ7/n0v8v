import { Json } from './auth';

export interface EmployeeTypes {
  Tables: {
    employees: {
      Row: {
        company_id: string | null
        created_at: string
        employee_number: string
        id: string
        manager_id: string | null
        profile_id: string | null
        start_date: string
      }
      Insert: {
        company_id?: string | null
        created_at?: string
        employee_number: string
        id?: string
        manager_id?: string | null
        profile_id?: string | null
        start_date: string
      }
      Update: {
        company_id?: string | null
        created_at?: string
        employee_number?: string
        id?: string
        manager_id?: string | null
        profile_id?: string | null
        start_date?: string
      }
      Relationships: [
        {
          foreignKeyName: "employees_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: false
          referencedRelation: "companies"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "employees_manager_id_fkey"
          columns: ["manager_id"]
          isOneToOne: false
          referencedRelation: "employees"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "employees_profile_id_fkey"
          columns: ["profile_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}