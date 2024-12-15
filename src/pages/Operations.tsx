import { Card } from "@/components/ui/card";
import { FacilitiesGrid } from "@/components/facilities/FacilitiesGrid";

const Operations = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Facilities Management</h1>
      <Card className="p-6">
        <FacilitiesGrid />
      </Card>
    </div>
  );
};

export default Operations;