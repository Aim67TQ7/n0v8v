import { AnalysisContent } from "@/components/process/AnalysisContent";

interface ProcessAnalysisResultsProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
    partInspectionId?: string;
    processImprovementId?: string;
    analysisTypeId?: string;
  } | null;
  partInspectionId?: string;
  processImprovementId?: string;
  analysisTypeId?: string;
}

export const ProcessAnalysisResults = ({ 
  analysis,
  partInspectionId,
  processImprovementId,
  analysisTypeId
}: ProcessAnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <AnalysisContent 
      analysis={analysis}
      partInspectionId={partInspectionId || analysis.partInspectionId}
      processImprovementId={processImprovementId || analysis.processImprovementId}
      analysisTypeId={analysisTypeId || analysis.analysisTypeId}
    />
  );
};