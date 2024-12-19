import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WorkCentersList } from "@/components/team/workcenters/WorkCentersList";
import { AddWorkCenterDialog } from "@/components/team/workcenters/AddWorkCenterDialog";
import { WorkCenterFilter } from "@/components/team/workcenters/WorkCenterFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const WorkCenters = () => {
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: workcenters = [] } = useQuery({
    queryKey: ['workcenters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workcenters')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Work Centers</h1>
        <AddWorkCenterDialog />
      </div>
      
      <Card className="p-6">
        <WorkCenterFilter 
          filter={filter} 
          filterBy={filterBy} 
          onFilterChange={setFilter} 
          onFilterByChange={setFilterBy} 
        />
        <WorkCentersList workcenters={workcenters} />
      </Card>
    </div>
  );
};

export default WorkCenters;