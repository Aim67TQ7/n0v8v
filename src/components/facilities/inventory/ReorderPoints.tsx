import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export const ReorderPoints = () => {
  const items = [
    { id: 1, name: "Hydraulic Filter", reorderPoint: 25, leadTime: "2 weeks" },
    { id: 2, name: "Drive Belt", reorderPoint: 18, leadTime: "1 week" },
    { id: 3, name: "Air Filter", reorderPoint: 12, leadTime: "3 days" },
    { id: 4, name: "Oil Filter", reorderPoint: 20, leadTime: "1 week" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <RefreshCw className="h-5 w-5" />
        Reorder Points
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Lead time: {item.leadTime}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">
                {item.reorderPoint}
              </span>
              <p className="text-sm text-gray-600">
                Reorder at
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};