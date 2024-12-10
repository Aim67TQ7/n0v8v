import { Json } from './auth';

export interface TrainingTypes {
  Tables: {
    training_logs: {
      Row: {
        completion_date: string
        created_at: string
        employee_id: string | null
        id: string
        next_due_date: string | null
        status: string
        training_name: string
      }
      Insert: {
        completion_date: string
        created_at?: string
        employee_id?: string | null
        id?: string
        next_due_date?: string | null
        status?: string
        training_name: string
      }
      Update: {
        completion_date?: string
        created_at?: string
        employee_id?: string | null
        id?: string
        next_due_date?: string | null
        status?: string
        training_name?: string
      }
      Relationships: [
        {
          foreignKeyName: "training_logs_employee_id_fkey"
          columns: ["employee_id"]
          isOneToOne: false
          referencedRelation: "employees"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}