import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LocationsList } from "@/components/team/locations/LocationsList";
import { LocationFilter } from "@/components/team/locations/LocationFilter";
import { AddLocationDialog } from "@/components/team/locations/AddLocationDialog";
import { Building2 } from "lucide-react";
import { AuthWrapper } from "@/components/AuthWrapper";

const Locations = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("facility_name");

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select(`
          *,
          primary_contact:employees(
            profile:profiles(first_name, last_name)
          )
        `)
        .order('facility_name');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredLocations = locations?.filter((location) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "facility_name":
        return location.facility_name.toLowerCase().includes(searchTerm);
      case "city":
        return location.physical_city.toLowerCase().includes(searchTerm);
      case "state":
        return location.physical_state.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <LocationFilter
              filter={filter}
              filterBy={filterBy}
              onFilterChange={setFilter}
              onFilterByChange={setFilterBy}
            />
            <AddLocationDialog />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <LocationsList locations={filteredLocations || []} />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Locations;