import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { AuthWrapper } from "@/components/AuthWrapper";
import { WorkCentersList } from "@/components/team/workcenters/WorkCentersList";
import { WorkCenterFilter } from "@/components/team/workcenters/WorkCenterFilter";
import { AddWorkCenterDialog } from "@/components/team/workcenters/AddWorkCenterDialog";

const WorkCenters = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: workcenters, isLoading } = useQuery({
    queryKey: ["workcenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workcenters")
        .select(`
          *,
          department
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredWorkcenters = workcenters?.filter((workcenter) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "name":
        return workcenter.name.toLowerCase().includes(searchTerm);
      case "department":
        return workcenter.department.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Work Centers</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <WorkCenterFilter
              filter={filter}
              filterBy={filterBy}
              onFilterChange={setFilter}
              onFilterByChange={setFilterBy}
            />
            <AddWorkCenterDialog />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <WorkCentersList workcenters={filteredWorkcenters || []} />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default WorkCenters;