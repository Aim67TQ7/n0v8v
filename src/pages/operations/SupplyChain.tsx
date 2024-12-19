import { Card } from "@/components/ui/card";
import { TruckIcon } from "lucide-react";

const SupplyChain = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <TruckIcon className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Supply Chain Management</h1>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">
          Supply chain management functionality coming soon.
        </p>
      </Card>
    </div>
  );
};

export default SupplyChain;