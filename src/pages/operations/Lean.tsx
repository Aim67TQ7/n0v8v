import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

const Lean = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Lean Manufacturing</h1>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">
          Lean manufacturing tools and processes coming soon.
        </p>
      </Card>
    </div>
  );
};

export default Lean;