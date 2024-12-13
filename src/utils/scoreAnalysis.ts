export const getScoreImpactSummary = (score: number | undefined, category: string) => {
  if (score === undefined) return "";
  if (score >= 8) return `Strong ${category} practices with minimal issues.`;
  if (score >= 6) return `Some ${category} challenges affecting efficiency.`;
  return `Significant ${category} issues impacting operations.`;
};