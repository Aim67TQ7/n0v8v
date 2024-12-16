import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const SafetyStock = () => {
  const items = [
    { id: 1, name: "Hydraulic Filter", safetyStock: 15, coverage: "1 month" },
    { id: 2, name: "Drive Belt", safetyStock: 10, coverage: "2 weeks" },
    { id: 3, name: "Air Filter", safetyStock: 8, coverage: "1 week" },
    { id: 4, name: "Oil Filter", safetyStock: 12, coverage: "3 weeks" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Safety Stock Levels
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Coverage: {item.coverage}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">
                {item.safetyStock}
              </span>
              <p className="text-sm text-gray-600">
                Minimum buffer
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};