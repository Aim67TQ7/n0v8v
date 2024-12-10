import { Json } from './auth';

export interface WorkcenterTypes {
  Tables: {
    workcenters: {
      Row: {
        company_id: string | null
        created_at: string
        department: string
        id: string
        name: string
      }
      Insert: {
        company_id?: string | null
        created_at?: string
        department: string
        id?: string
        name: string
      }
      Update: {
        company_id?: string | null
        created_at?: string
        department?: string
        id?: string
        name?: string
      }
      Relationships: [
        {
          foreignKeyName: "workcenters_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: false
          referencedRelation: "companies"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}