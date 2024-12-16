import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";

export const InventoryStats = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5" />
        Inventory Statistics
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">In Stock</span>
          </div>
          <span className="text-2xl font-bold">1,234</span>
          <p className="text-sm text-gray-600 mt-1">Total items</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Low Stock</span>
          </div>
          <span className="text-2xl font-bold">23</span>
          <p className="text-sm text-gray-600 mt-1">Items below threshold</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Pending Orders</span>
          </div>
          <span className="text-2xl font-bold">12</span>
          <p className="text-sm text-gray-600 mt-1">Active reorders</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Total Value</span>
          </div>
          <span className="text-2xl font-bold">$45.2K</span>
          <p className="text-sm text-gray-600 mt-1">Inventory worth</p>
        </div>
      </div>
    </Card>
  );
};