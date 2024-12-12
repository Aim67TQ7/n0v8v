import { GitFork } from "lucide-react";

export const AnalysisHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <GitFork className="h-8 w-8 text-secondary" />
      <h1 className="text-3xl font-bold">Five Whys Analysis</h1>
    </div>
  );
};