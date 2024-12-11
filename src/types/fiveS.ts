export interface FiveSEvaluation {
  id: string;
  workcenter_id: string;
  workcenter?: {
    name: string;
  };
  created_at: string;
  created_by: string;
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
  safety_deduction: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  evaluation_images: {
    id: string;
    image_url: string;
    image_type: string;
  }[];
}