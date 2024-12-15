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

// Type guard to check if a JSON value is a ChecklistItem[]
export function isChecklistItemArray(value: unknown): value is ChecklistItem[] {
  if (!Array.isArray(value)) return false;
  return value.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'item' in item &&
    'score' in item &&
    typeof item.item === 'string' &&
    typeof item.score === 'number'
  );
}

// Helper function to safely parse JSON checklist data
export function parseChecklistData(data: unknown): ChecklistItem[] {
  if (!data) return [];
  if (isChecklistItemArray(data)) return data;
  return [];
}