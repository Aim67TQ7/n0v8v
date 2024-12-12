import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TrainingFeedbackForm } from "./TrainingFeedbackForm";
import { AnalysisFeedbackButtons } from "./AnalysisFeedbackButtons";

interface AnalysisContentProps {
  analysis: {
    status: 'success' | 'concerns';
    message: string;
    details: string;
  } | null;
  partInspectionId?: string;
  processImprovementId?: string;
  inspectionTypeId?: string;
}

export const AnalysisContent = ({ 
  analysis, 
  partInspectionId,
  processImprovementId,
  inspectionTypeId 
}: AnalysisContentProps) => {
  const [isTraining, setIsTraining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!analysis) return null;

  const detailLines = analysis.details ? analysis.details.split('\n') : [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {analysis.status === 'success' ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        )}
        <h2 className="text-xl font-semibold">{analysis.message}</h2>
      </div>
      <div className="prose prose-sm mb-6">
        {detailLines.map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>

      <AnalysisFeedbackButtons
        processImprovementId={processImprovementId}
        partInspectionId={partInspectionId}
        inspectionTypeId={inspectionTypeId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        onTrainingClick={() => setIsTraining(true)}
      />

      {isTraining && (
        <TrainingFeedbackForm
          processImprovementId={processImprovementId}
          partInspectionId={partInspectionId}
          inspectionTypeId={inspectionTypeId}
          onCancel={() => setIsTraining(false)}
          onSuccess={() => setIsTraining(false)}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
    </Card>
  );
};