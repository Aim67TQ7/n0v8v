import { Button } from "@/components/ui/button";
import { Microscope, RotateCcw } from "lucide-react";

interface PartAnalysisHeaderProps {
  onStartNew: () => void;
}

export const PartAnalysisHeader = ({ onStartNew }: PartAnalysisHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Microscope className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Part Analysis</h1>
      </div>
      <Button
        onClick={onStartNew}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Start New Analysis
      </Button>
    </div>
  );
};