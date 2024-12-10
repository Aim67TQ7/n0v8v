import { Json } from './auth';

export interface EvaluationTypes {
  Tables: {
    five_s_evaluations: {
      Row: {
        created_at: string
        created_by: string
        id: string
        opportunities: string[] | null
        safety_deduction: number | null
        set_in_order_score: number | null
        shine_score: number | null
        sort_score: number | null
        standardize_score: number | null
        strengths: string[] | null
        sustain_score: number | null
        threats: string[] | null
        weaknesses: string[] | null
        workcenter_id: string
      }
      Insert: {
        created_at?: string
        created_by: string
        id?: string
        opportunities?: string[] | null
        safety_deduction?: number | null
        set_in_order_score?: number | null
        shine_score?: number | null
        sort_score?: number | null
        standardize_score?: number | null
        strengths?: string[] | null
        sustain_score?: number | null
        threats?: string[] | null
        weaknesses?: string[] | null
        workcenter_id: string
      }
      Update: {
        created_at?: string
        created_by?: string
        id?: string
        opportunities?: string[] | null
        safety_deduction?: number | null
        set_in_order_score?: number | null
        shine_score?: number | null
        sort_score?: number | null
        standardize_score?: number | null
        strengths?: string[] | null
        sustain_score?: number | null
        threats?: string[] | null
        weaknesses?: string[] | null
        workcenter_id?: string
      }
      Relationships: [
        {
          foreignKeyName: "five_s_evaluations_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "profiles"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "five_s_evaluations_workcenter_id_fkey"
          columns: ["workcenter_id"]
          isOneToOne: false
          referencedRelation: "workcenters"
          referencedColumns: ["id"]
        }
      ]
    }
    evaluation_images: {
      Row: {
        created_at: string
        evaluation_id: string
        id: string
        image_type: string
        image_url: string
      }
      Insert: {
        created_at?: string
        evaluation_id: string
        id?: string
        image_type: string
        image_url: string
      }
      Update: {
        created_at?: string
        evaluation_id?: string
        id?: string
        image_type?: string
        image_url?: string
      }
      Relationships: [
        {
          foreignKeyName: "evaluation_images_evaluation_id_fkey"
          columns: ["evaluation_id"]
          isOneToOne: false
          referencedRelation: "five_s_evaluations"
          referencedColumns: ["id"]
        }
      ]
    }
  }
}