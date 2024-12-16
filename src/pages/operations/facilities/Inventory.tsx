import { Card } from "@/components/ui/card";
import { InventoryOverview } from "@/components/facilities/inventory/InventoryOverview";
import { InventoryStats } from "@/components/facilities/inventory/InventoryStats";
import { ReorderPoints } from "@/components/facilities/inventory/ReorderPoints";
import { SafetyStock } from "@/components/facilities/inventory/SafetyStock";

const Inventory = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventoryStats />
        <InventoryOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReorderPoints />
        <SafetyStock />
      </div>
    </div>
  );
};

export default Inventory;