import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LocationsList } from "@/components/team/locations/LocationsList";
import { AddLocationDialog } from "@/components/team/locations/AddLocationDialog";
import { LocationFilter } from "@/components/team/locations/LocationFilter";

const Locations = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Locations</h1>
        <AddLocationDialog />
      </div>
      
      <Card className="p-6">
        <LocationFilter value={filter} onChange={setFilter} />
        <LocationsList />
      </Card>
    </div>
  );
};

export default Locations;