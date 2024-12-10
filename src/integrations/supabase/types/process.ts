import { Json } from './auth';

export interface ProcessTypes {
  Tables: {
    process_improvements: {
      Row: {
        analysis: string
        created_at: string
        created_by: string | null
        id: string
        image_url: string
        workcenter_id: string | null
      }
      Insert: {
        analysis: string
        created_at?: string
        created_by?: string | null
        id?: string
        image_url: string
        workcenter_id?: string | null
      }
      Update: {
        analysis?: string
        created_at?: string
        created_by?: string | null
        id?: string
        image_url?: string
        workcenter_id?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "process_improvements_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "process_improvements_workcenter_id_fkey"
          columns: ["workcenter_id"]
          isOneToOne: false
          referencedRelation: "workcenters"
          referencedColumns: ["id"]
        }
      ]
    }
    process_analysis_reports: {
      Row: {
        analysis_date: string | null
        created_at: string | null
        created_by: string | null
        id: string
        job_number: string | null
        part_number: string | null
        po_number: string | null
        process_improvement_id: string | null
      }
      Insert: {
        analysis_date?: string | null
        created_at?: string | null
        created_by?: string | null
        id?: string
        job_number?: string | null
        part_number?: string | null
        po_number?: string | null
        process_improvement_id?: string | null
      }
      Update: {
        analysis_date?: string | null
        created_at?: string | null
        created_by?: string | null
        id?: string
        job_number?: string | null
        part_number?: string | null
        po_number?: string | null
        process_improvement_id?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "process_analysis_reports_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "process_analysis_reports_process_improvement_id_fkey"
          columns: ["process_improvement_id"]
          isOneToOne: false
          referencedRelation: "process_improvements"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}