import { AnalysisContent } from "@/components/process/AnalysisContent";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Nothing found. Please try adjusting your selection or try a different image.</p>
        </div>
      </Card>
    );
  }

  return (
    <AnalysisContent 
      analysis={analysis}
      partInspectionId={partInspectionId || analysis.partInspectionId}
      processImprovementId={processImprovementId || analysis.processImprovementId}
      analysisTypeId={analysisTypeId || analysis.analysisTypeId}
    />
  );
};