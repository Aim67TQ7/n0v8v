import { CRMDashboard } from "@/components/customer-focus/CRMDashboard";
import { Building } from "lucide-react";

const CustomerFocus = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Building className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Customer Focus</h1>
      </div>
      <CRMDashboard />
    </div>
  );
};

export default CustomerFocus;