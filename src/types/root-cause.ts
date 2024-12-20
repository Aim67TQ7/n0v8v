export interface Iteration {
  id?: string;  // Added id property
  whyQuestion: string;
  assumptions: string[];
  selectedAssumption: string;
}

export interface RootCauseState {
  problemStatement: string;
  userReason: string;
  currentStep: number;
  isAnalyzing: boolean;
  iterations: Iteration[];
  currentAssumptions: string[];
  selectedAssumption: string;
  whyQuestion: string;
  rephrasedProblem: string;
}