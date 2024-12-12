import { AnalysisContent } from "@/components/process/AnalysisContent";

interface ProcessAnalysisResultsProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
    partInspectionId?: string;
    processImprovementId?: string;
    inspectionTypeId?: string;
  } | null;
  partInspectionId?: string;
  processImprovementId?: string;
  inspectionTypeId?: string;
}

export const ProcessAnalysisResults = ({ 
  analysis,
  partInspectionId,
  processImprovementId,
  inspectionTypeId
}: ProcessAnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <AnalysisContent 
      analysis={analysis}
      partInspectionId={partInspectionId || analysis.partInspectionId}
      processImprovementId={processImprovementId || analysis.processImprovementId}
      inspectionTypeId={inspectionTypeId || analysis.inspectionTypeId}
    />
  );
};