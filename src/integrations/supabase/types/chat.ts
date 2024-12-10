import { Json } from './auth';

export interface ChatTypes {
  Tables: {
    chat_logs: {
      Row: {
        company_id: string | null
        created_at: string
        id: string
        messages: Json
        model: string
        user_id: string | null
      }
      Insert: {
        company_id?: string | null
        created_at?: string
        id?: string
        messages: Json
        model: string
        user_id?: string | null
      }
      Update: {
        company_id?: string | null
        created_at?: string
        id?: string
        messages?: Json
        model?: string
        user_id?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "chat_logs_company_id_fkey"
          columns: ["company_id"]
          isOneToOne: false
          referencedRelation: "companies"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "chat_logs_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}