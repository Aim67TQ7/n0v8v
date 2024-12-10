export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface AuthTypes {
  Tables: {
    Auth: {
      Row: {
        created_at: string
        id: number
      }
      Insert: {
        created_at?: string
        id?: number
      }
      Update: {
        created_at?: string
        id?: number
      }
      Relationships: []
    }
  }
}