import { AnalysisContent } from "@/components/process/AnalysisContent";

interface ProcessAnalysisResultsProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
    partInspectionId?: string;
    inspectionTypeId?: string;
  } | null;
  partInspectionId?: string;
  inspectionTypeId?: string;
}

export const ProcessAnalysisResults = ({ 
  analysis,
  partInspectionId,
  inspectionTypeId
}: ProcessAnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <AnalysisContent 
      analysis={analysis}
      partInspectionId={partInspectionId || analysis.partInspectionId}
      inspectionTypeId={inspectionTypeId || analysis.inspectionTypeId}
    />
  );
};