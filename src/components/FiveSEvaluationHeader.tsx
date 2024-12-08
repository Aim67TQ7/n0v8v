import { Eye, Save, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FiveSEvaluationHeaderProps {
  workcenterId: string;
  onSavePDF: () => void;
  onEmailPDF: () => void;
}

export const FiveSEvaluationHeader = ({ workcenterId, onSavePDF, onEmailPDF }: FiveSEvaluationHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Eye className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">5S Vision Evaluation</h1>
      </div>
      <div className="space-x-4">
        <Button variant="outline" onClick={onSavePDF}>
          <Save className="w-4 h-4 mr-2" />
          Save as PDF
        </Button>
        <Button variant="outline" onClick={onEmailPDF}>
          <Mail className="w-4 h-4 mr-2" />
          Email PDF
        </Button>
      </div>
    </div>
  );
};