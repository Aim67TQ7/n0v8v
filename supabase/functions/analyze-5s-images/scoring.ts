export interface Score {
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
  safety_deduction: number;
}

export const calculateSafetyDeduction = (findings: string[]): number => {
  let deduction = 0;
  
  for (const finding of findings) {
    if (finding.toLowerCase().includes('severe safety hazard')) {
      deduction = -5;
      break;
    } else if (finding.toLowerCase().includes('moderate safety concern')) {
      deduction = -3;
      break;
    } else if (finding.toLowerCase().includes('minor safety issue')) {
      deduction = -1;
      break;
    }
  }
  
  return deduction;
};

export const calculateTotalScore = (scores: Score): number => {
  const baseScore = scores.sort_score + 
                   scores.set_in_order_score + 
                   scores.shine_score + 
                   scores.standardize_score + 
                   scores.sustain_score;
                   
  // Apply safety deduction (if any) to the total score
  return Math.max(0, baseScore + scores.safety_deduction);
};