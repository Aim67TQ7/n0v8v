import { Json } from './auth';

export interface CompanyTypes {
  Tables: {
    companies: {
      Row: {
        created_at: string
        id: string
        license_number: string
        license_type: string
        max_users: number
        name: string
      }
      Insert: {
        created_at?: string
        id?: string
        license_number?: string
        license_type?: string
        max_users?: number
        name: string
      }
      Update: {
        created_at?: string
        id?: string
        license_number?: string
        license_type?: string
        max_users?: number
        name?: string
      }
      Relationships: []
    }
    company_settings: {
      Row: {
        company_id: string | null
        created_at: string | null
        gpt_name: string
        id: string
        updated_at: string | null
      }
      Insert: {
        company_id?: string | null
        created_at?: string | null
        gpt_name: string
        id?: string
        updated_at?: string | null
      }
      Update: {
        company_id?: string | null
        created_at?: string | null
        gpt_name?: string
        id?: string
        updated_at?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "company_settings_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: true
          referencedRelation: "companies"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}