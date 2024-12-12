export interface MaintenanceSchedule {
  id: string;
  equipment_id: string;
  created_at: string;
  frequency: string;
  skill_level: string;
  tools_needed: string[];
  estimated_time: string | null;
  is_critical: boolean;
  task_description: string;
  safety_precautions: string[];
  procedure_steps: string[];
}