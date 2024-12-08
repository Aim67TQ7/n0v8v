import { Card } from "@/components/ui/card";
import { FileWarning } from "lucide-react";

const DMRDocumentation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FileWarning className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">DMR Documentation</h1>
      </div>
      
      <Card className="p-6">
        <p className="text-gray-600">
          Track and analyze discrepancy reports functionality coming soon.
        </p>
      </Card>
    </div>
  );
};

export default DMRDocumentation;