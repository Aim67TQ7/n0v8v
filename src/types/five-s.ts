export interface ChecklistItem {
  item: string;
  score: number;
  description?: string;
}

export interface FiveSDetailedReport {
  id: string;
  evaluation_id: string | null;
  created_at: string;
  created_by: string | null;
  sort_checklist: ChecklistItem[];
  sort_positive_observations: string[];
  sort_concerns: string[];
  set_checklist: ChecklistItem[];
  set_positive_observations: string[];
  set_concerns: string[];
  shine_checklist: ChecklistItem[];
  shine_positive_observations: string[];
  shine_concerns: string[];
  follow_up_actions: string[];
  recommendations: string[];
}