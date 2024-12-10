import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SaveReportDialog } from "./process/SaveReportDialog";
import { AnalysisContent } from "./process/AnalysisContent";

interface ProcessAnalysisResultsProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
  } | null;
  processImprovementId?: string;
}

export const ProcessAnalysisResults = ({ 
  analysis, 
  processImprovementId 
}: ProcessAnalysisResultsProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  if (!analysis) return null;

  return (
    <>
      <AnalysisContent analysis={analysis} />
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
          Skip
        </Button>
        <Button onClick={() => setShowSaveDialog(true)}>
          Save Report
        </Button>
      </div>

      <SaveReportDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        processImprovementId={processImprovementId}
      />
    </>
  );
};