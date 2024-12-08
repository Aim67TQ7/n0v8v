import { Card } from "@/components/ui/card";
import { GitFork } from "lucide-react";

const FiveWhys = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <GitFork className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Five Whys Analysis</h1>
      </div>
      
      <Card className="p-6">
        <p className="text-gray-600">
          AI-guided root cause analysis tools coming soon.
        </p>
      </Card>
    </div>
  );
};

export default FiveWhys;