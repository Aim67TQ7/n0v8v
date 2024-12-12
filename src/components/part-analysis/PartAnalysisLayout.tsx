import { Card } from "@/components/ui/card";
import { PartAnalysisForm } from "@/components/quality/PartAnalysisForm";
import { ProcessAnalysisResults } from "@/components/ProcessAnalysisResults";

interface PartAnalysisLayoutProps {
  analysis: any;
  onAnalysisComplete: (analysis: any) => void;
}

export const PartAnalysisLayout = ({ analysis, onAnalysisComplete }: PartAnalysisLayoutProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <PartAnalysisForm onAnalysisComplete={onAnalysisComplete} />
      </Card>

      <div className="space-y-6">
        <ProcessAnalysisResults 
          analysis={analysis} 
          partInspectionId={analysis?.partInspectionId}
          analysisTypeId={analysis?.analysisTypeId}
        />
      </div>
    </div>
  );
};