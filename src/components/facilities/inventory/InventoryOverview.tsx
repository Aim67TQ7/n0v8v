import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "lucide-react";

export const InventoryOverview = () => {
  const items = [
    { id: 1, name: "Hydraulic Filter", quantity: 45, minStock: 20, status: "Good" },
    { id: 2, name: "Drive Belt", quantity: 12, minStock: 15, status: "Low" },
    { id: 3, name: "Air Filter", quantity: 8, minStock: 10, status: "Low" },
    { id: 4, name: "Oil Filter", quantity: 30, minStock: 15, status: "Good" },
    { id: 5, name: "Bearing Set", quantity: 25, minStock: 10, status: "Good" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5" />
        Current Stock Levels
      </h2>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Min stock: {item.minStock}</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-semibold ${
                  item.status === "Low" ? "text-red-600" : "text-green-600"
                }`}>
                  {item.quantity}
                </span>
                <p className={`text-sm ${
                  item.status === "Low" ? "text-red-600" : "text-green-600"
                }`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};