import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LocationsList } from "@/components/team/locations/LocationsList";
import { AddLocationDialog } from "@/components/team/locations/AddLocationDialog";
import { LocationFilter } from "@/components/team/locations/LocationFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Locations = () => {
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Locations</h1>
        <AddLocationDialog />
      </div>
      
      <Card className="p-6">
        <LocationFilter 
          filter={filter} 
          filterBy={filterBy} 
          onFilterChange={setFilter} 
          onFilterByChange={setFilterBy} 
        />
        <LocationsList locations={locations} />
      </Card>
    </div>
  );
};

export default Locations;