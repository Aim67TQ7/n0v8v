import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamFilter } from "./TeamFilter";
import { TeamActions } from "./TeamActions";
import { DepartmentTable } from "./DepartmentTable";

export const WorkcenterTab = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("department");
  const [workcenterSortField, setWorkcenterSortField] = useState("name");
  const [workcenterSortDirection, setWorkcenterSortDirection] = useState<"asc" | "desc">("asc");

  const { data: workcenters, isLoading: isLoadingWorkcenters } = useQuery({
    queryKey: ["workcenters", workcenterSortField, workcenterSortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workcenters")
        .select("*")
        .order(workcenterSortField, { ascending: workcenterSortDirection === "asc" });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleWorkcenterSort = (field: string) => {
    if (field === workcenterSortField) {
      setWorkcenterSortDirection(workcenterSortDirection === "asc" ? "desc" : "asc");
    } else {
      setWorkcenterSortField(field);
      setWorkcenterSortDirection("asc");
    }
  };

  const filteredWorkcenters = workcenters?.filter((workcenter) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "department":
        return workcenter.department.toLowerCase().includes(searchTerm);
      case "name":
        return workcenter.name.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <TeamFilter
          filter={filter}
          filterBy={filterBy}
          onFilterChange={setFilter}
          onFilterByChange={setFilterBy}
        />
        <TeamActions />
      </div>

      {isLoadingWorkcenters ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DepartmentTable
            departments={filteredWorkcenters || []}
            sortField={workcenterSortField}
            sortDirection={workcenterSortDirection}
            onSort={handleWorkcenterSort}
          />
        </div>
      )}
    </div>
  );
};