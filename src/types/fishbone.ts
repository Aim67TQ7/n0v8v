export type CauseCategory = 'Man' | 'Machine' | 'Method' | 'Material' | 'Environment';

export interface Cause {
  id: string;
  text: string;
  checked: boolean;
  category: CauseCategory;
  subcauses?: Cause[];
}

export interface Branch {
  id: string;
  text: string;
  children?: Branch[];
  parentId?: string;
  iteration: number;
}

export interface AnalysisStep {
  category: CauseCategory;
  title: string;
  description: string;
  causes: Cause[];
}

export interface FishboneState {
  currentStep: number;
  steps: AnalysisStep[];
  selectedCauses: Cause[];
  round: 1 | 2;
  branches?: Branch[];
}