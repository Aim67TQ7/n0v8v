import { Card } from "@/components/ui/card";
import { Microscope } from "lucide-react";

const ProcessImprovement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Microscope className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Process Improvement</h1>
      </div>
      
      <Card className="p-6">
        <p className="text-gray-600">
          AI-powered quality analysis and process optimization tools coming soon.
        </p>
      </Card>
    </div>
  );
};

export default ProcessImprovement;