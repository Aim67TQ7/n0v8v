import { Loader2 } from "lucide-react";
import { FiveSEvaluationHeader } from "@/components/FiveSEvaluationHeader";
import { FiveSEvaluationContent } from "@/components/FiveSEvaluationContent";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

interface FiveSEvaluationResultsProps {
  evaluation: any;
  onNewEvaluation: () => void;
  isLoading: boolean;
}

export const FiveSEvaluationResults = ({ 
  evaluation, 
  onNewEvaluation,
  isLoading 
}: FiveSEvaluationResultsProps) => {
  const { toast } = useToast();

  const handleSavePDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });

      const element = document.getElementById('evaluation-content');
      if (!element) return;

      const opt = {
        margin: 5,
        filename: `5S-Evaluation-${evaluation.workcenter?.name}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(element).save();

      toast({
        title: "Success",
        description: "PDF report has been generated and downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailPDF = () => {
    toast({
      title: "Coming Soon",
      description: "Email PDF functionality will be available soon",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2">Loading evaluation results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FiveSEvaluationHeader
        workcenterId={evaluation.workcenter_id}
        onSavePDF={handleSavePDF}
        onEmailPDF={handleEmailPDF}
      />

      <div id="evaluation-content" className="scale-[0.85] origin-top">
        <FiveSEvaluationContent 
          evaluation={evaluation}
          onNewEvaluation={onNewEvaluation}
        />
      </div>
    </div>
  );
};