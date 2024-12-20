import { Button } from "@/components/ui/button";
import { Iteration } from "@/types/root-cause";

interface RootCauseHistoryProps {
  iterations: Iteration[];
  onReset: () => void;
  showReset: boolean;
}

export const RootCauseHistory = ({ iterations, onReset, showReset }: RootCauseHistoryProps) => {
  if (!iterations.length && !showReset) return null;

  return (
    <div className="space-y-4 mt-6">
      {iterations.length > 0 && (
        <>
          <h3 className="font-medium">Analysis History:</h3>
          <div className="space-y-3">
            {iterations.map((iteration, index) => (
              <div key={index} className="bg-muted p-3 rounded-lg">
                <p className="font-medium">{iteration.whyQuestion}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {iteration.selectedAssumption}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {showReset && (
        <Button variant="outline" onClick={onReset}>
          Start New Analysis
        </Button>
      )}
    </div>
  );
};