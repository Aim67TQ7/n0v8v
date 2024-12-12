export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_personalities: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          provider: string
          system_prompt: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          provider: string
          system_prompt: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          provider?: string
          system_prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_personalities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
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
      categories: {
        Row: {
          company_id: string | null
          created_at: string
          department_id: string | null
          description: string | null
          id: string
          location_id: string | null
          manager_id: string | null
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          manager_id?: string | null
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          manager_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          company_id: string | null
          created_at: string
          expires_at: string
          id: string
          messages: Json
          model: string
          title: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          messages: Json
          model: string
          title?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          messages?: Json
          model?: string
          title?: string
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
          },
        ]
      }
      companies: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          created_at: string
          id: string
          license_number: string
          license_type: string
          max_users: number
          name: string
          status: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          license_number?: string
          license_type?: string
          max_users?: number
          name: string
          status?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          license_number?: string
          license_type?: string
          max_users?: number
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      company_details: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_state: string | null
          billing_zip: string | null
          business_type: string | null
          contact_phone: string | null
          created_at: string | null
          demo_ends_at: string | null
          demo_starts_at: string | null
          gpt_name: string | null
          id: string
          industry: string | null
          name: string
          submission_status: string | null
          tax_exempt: boolean | null
          tax_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          business_type?: string | null
          contact_phone?: string | null
          created_at?: string | null
          demo_ends_at?: string | null
          demo_starts_at?: string | null
          gpt_name?: string | null
          id: string
          industry?: string | null
          name: string
          submission_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          business_type?: string | null
          contact_phone?: string | null
          created_at?: string | null
          demo_ends_at?: string | null
          demo_starts_at?: string | null
          gpt_name?: string | null
          id?: string
          industry?: string | null
          name?: string
          submission_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          accounting_code: string | null
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
          accounting_code?: string | null
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
          accounting_code?: string | null
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
          },
        ]
      }
      document_embeddings: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: never
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: never
          metadata?: Json | null
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
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
          },
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
          },
        ]
      }
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
          },
        ]
      }
      five_whys_analysis: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          fishbone_data: Json | null
          id: string
          problem_statement: string
          selected_causes: string[]
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          fishbone_data?: Json | null
          id?: string
          problem_statement: string
          selected_causes?: string[]
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          fishbone_data?: Json | null
          id?: string
          problem_statement?: string
          selected_causes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "five_whys_analysis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "five_whys_analysis_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          prompt_template: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          prompt_template: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          prompt_template?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          company_id: string | null
          created_at: string
          facility_name: string
          id: string
          physical_address: string
          physical_city: string
          physical_country: string
          physical_state: string
          physical_zip: string
          primary_contact_id: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_state: string | null
          shipping_zip: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          facility_name: string
          id?: string
          physical_address: string
          physical_city: string
          physical_country: string
          physical_state: string
          physical_zip: string
          primary_contact_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          facility_name?: string
          id?: string
          physical_address?: string
          physical_city?: string
          physical_country?: string
          physical_state?: string
          physical_zip?: string
          primary_contact_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      part_analysis_feedback: {
        Row: {
          comments: string | null
          created_at: string
          created_by: string | null
          feedback_type: string
          id: string
          inspection_type_id: string | null
          marked_areas: Json | null
          process_improvement_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          created_by?: string | null
          feedback_type: string
          id?: string
          inspection_type_id?: string | null
          marked_areas?: Json | null
          process_improvement_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          created_by?: string | null
          feedback_type?: string
          id?: string
          inspection_type_id?: string | null
          marked_areas?: Json | null
          process_improvement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_analysis_feedback_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_analysis_feedback_inspection_type_id_fkey"
            columns: ["inspection_type_id"]
            isOneToOne: false
            referencedRelation: "inspection_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_analysis_feedback_process_improvement_id_fkey"
            columns: ["process_improvement_id"]
            isOneToOne: false
            referencedRelation: "process_improvements"
            referencedColumns: ["id"]
          },
        ]
      }
      part_inspections: {
        Row: {
          analysis: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string
          inspection_type_id: string
          workcenter_id: string | null
        }
        Insert: {
          analysis: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url: string
          inspection_type_id: string
          workcenter_id?: string | null
        }
        Update: {
          analysis?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string
          inspection_type_id?: string
          workcenter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_inspections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_inspections_inspection_type_id_fkey"
            columns: ["inspection_type_id"]
            isOneToOne: false
            referencedRelation: "inspection_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_inspections_workcenter_id_fkey"
            columns: ["workcenter_id"]
            isOneToOne: false
            referencedRelation: "workcenters"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "fk_process_improvement"
            columns: ["process_improvement_id"]
            isOneToOne: false
            referencedRelation: "process_improvements"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
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
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          demo_access_expires: string | null
          email: string
          first_name: string | null
          id: string
          invite_code: string | null
          last_name: string | null
          phone_number: string | null
          photo_url: string | null
          role: string
          verified_phone: boolean | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          demo_access_expires?: string | null
          email: string
          first_name?: string | null
          id: string
          invite_code?: string | null
          last_name?: string | null
          phone_number?: string | null
          photo_url?: string | null
          role?: string
          verified_phone?: boolean | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          demo_access_expires?: string | null
          email?: string
          first_name?: string | null
          id?: string
          invite_code?: string | null
          last_name?: string | null
          phone_number?: string | null
          photo_url?: string | null
          role?: string
          verified_phone?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_matrix: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          last_review_date: string
          next_review_date: string | null
          skill_level: string
          workcenter_id: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          last_review_date: string
          next_review_date?: string | null
          skill_level: string
          workcenter_id?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          last_review_date?: string
          next_review_date?: string | null
          skill_level?: string
          workcenter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_matrix_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skills_matrix_workcenter_id_fkey"
            columns: ["workcenter_id"]
            isOneToOne: false
            referencedRelation: "workcenters"
            referencedColumns: ["id"]
          },
        ]
      }
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
          },
        ]
      }
      vave_analysis_reports: {
        Row: {
          analysis_data: Json
          created_at: string
          created_by: string | null
          id: string
          image_url: string
          job_number: string | null
          part_number: string | null
          po_number: string | null
          workcenter_id: string | null
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          created_by?: string | null
          id?: string
          image_url: string
          job_number?: string | null
          part_number?: string | null
          po_number?: string | null
          workcenter_id?: string | null
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string
          job_number?: string | null
          part_number?: string | null
          po_number?: string | null
          workcenter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vave_analysis_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vave_analysis_reports_workcenter_id_fkey"
            columns: ["workcenter_id"]
            isOneToOne: false
            referencedRelation: "workcenters"
            referencedColumns: ["id"]
          },
        ]
      }
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
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      cleanup_expired_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_licensed_company: {
        Args: {
          company_name: string
          license_type?: string
          max_users?: number
        }
        Returns: string
      }
      generate_license_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
