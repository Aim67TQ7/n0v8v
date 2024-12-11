import { Button } from "@/components/ui/button";

interface FishboneResultProps {
  fishboneData: any;
  onReset: () => void;
}

export const FishboneResult = ({ fishboneData, onReset }: FishboneResultProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
          New Analysis
        </Button>
      </div>
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm">
          {fishboneData}
        </pre>
      </div>
    </div>
  );
};