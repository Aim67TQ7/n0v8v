import { Card } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

const ProductInspection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardCheck className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Product Inspection</h1>
      </div>
      
      <Card className="p-6">
        <p className="text-gray-600">
          Automated visual inspection and pass/fail analysis tools coming soon.
        </p>
      </Card>
    </div>
  );
};

export default ProductInspection;