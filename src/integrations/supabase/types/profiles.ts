import { Json } from './auth';

export interface ProfileTypes {
  Tables: {
    profiles: {
      Row: {
        id: string
        first_name: string | null
        last_name: string | null
        email: string
        company_id: string | null
        role: string
        created_at: string
        photo_url: string | null
        demo_access_expires: string | null
      }
      Insert: {
        id: string
        first_name?: string | null
        last_name?: string | null
        email: string
        company_id?: string | null
        role?: string
        created_at?: string
        photo_url?: string | null
        demo_access_expires?: string | null
      }
      Update: {
        id?: string
        first_name?: string | null
        last_name?: string | null
        email?: string
        company_id?: string | null
        role?: string
        created_at?: string
        photo_url?: string | null
        demo_access_expires?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "profiles_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: false
          referencedRelation: "companies"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}