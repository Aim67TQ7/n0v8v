import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const Sales = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <DollarSign className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Sales Operations</h1>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">
          Sales operations functionality coming soon.
        </p>
      </Card>
    </div>
  );
};

export default Sales;