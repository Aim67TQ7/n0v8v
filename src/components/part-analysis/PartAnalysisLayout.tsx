import { Card } from "@/components/ui/card";
import { PartAnalysisForm } from "@/components/quality/PartAnalysisForm";
import { AnalysisContent } from "@/components/process/AnalysisContent";

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
        <AnalysisContent analysis={analysis} />
      </div>
    </div>
  );
};