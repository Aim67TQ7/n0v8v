import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamActions } from "@/components/team/TeamActions";
import { TeamFilter } from "@/components/team/TeamFilter";
import { DepartmentTable } from "@/components/team/DepartmentTable";

const TeamManagement = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("department");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          leader:leader_id(
            id,
            first_name,
            last_name,
            photo_url
          ),
          department_members(
            profile:profile_id(
              id,
              first_name,
              last_name,
              photo_url
            )
          )
        `)
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredDepartments = departments?.filter((dept) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "department":
        return dept.name.toLowerCase().includes(searchTerm);
      case "location":
        return dept.location.toLowerCase().includes(searchTerm);
      case "leader":
        return (
          dept.leader?.first_name.toLowerCase().includes(searchTerm) ||
          dept.leader?.last_name.toLowerCase().includes(searchTerm)
        );
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
      </div>

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

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <DepartmentTable
              departments={filteredDepartments || []}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;