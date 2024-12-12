import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isAnalyzing: boolean;
}

export const AnalyzeButton = ({ onClick, disabled, isAnalyzing }: AnalyzeButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Analyzing Part...
        </>
      ) : (
        'Analyze Part'
      )}
    </Button>
  );
};