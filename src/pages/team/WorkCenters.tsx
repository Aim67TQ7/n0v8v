import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WorkCentersList } from "@/components/team/workcenters/WorkCentersList";
import { AddWorkCenterDialog } from "@/components/team/workcenters/AddWorkCenterDialog";
import { WorkCenterFilter } from "@/components/team/workcenters/WorkCenterFilter";

const WorkCenters = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Work Centers</h1>
        <AddWorkCenterDialog />
      </div>
      
      <Card className="p-6">
        <WorkCenterFilter value={filter} onChange={setFilter} />
        <WorkCentersList />
      </Card>
    </div>
  );
};

export default WorkCenters;