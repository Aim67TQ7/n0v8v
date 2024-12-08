export interface Score {
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
  safety_deduction: number;
}

export const calculateSafetyDeduction = (findings: string[]): number => {
  for (const finding of findings) {
    const lowercaseFinding = finding.toLowerCase();
    if (lowercaseFinding.includes('severe safety hazard') || 
        lowercaseFinding.includes('immediate risk')) {
      return -5;
    } else if (lowercaseFinding.includes('moderate safety concern') || 
               lowercaseFinding.includes('potential risk')) {
      return -3;
    } else if (lowercaseFinding.includes('minor safety issue') || 
               lowercaseFinding.includes('low-risk')) {
      return -1;
    }
  }
  return 0;
};

export const calculateTotalScore = (scores: Score): number => {
  const baseScore = scores.sort_score + 
                   scores.set_in_order_score + 
                   scores.shine_score + 
                   scores.standardize_score + 
                   scores.sustain_score;
                   
  // Apply safety deduction (if any) to the total score, ensuring it doesn't go below 0
  return Math.max(0, baseScore + scores.safety_deduction);
};