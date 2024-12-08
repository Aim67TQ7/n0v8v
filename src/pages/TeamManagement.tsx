import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DepartmentTable } from "@/components/team/DepartmentTable";
import { TeamFilter } from "@/components/team/TeamFilter";
import { TeamActions } from "@/components/team/TeamActions";

const TeamManagement = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("department");
  const [sortField, setSortField] = useState<string>("department");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          leader:profiles(id, first_name, last_name, photo_url),
          department_members(
            profile:profiles(id, first_name, last_name, photo_url)
          )
        `);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching departments",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const filteredDepartments = departments?.filter((dept) => {
    const searchValue = filter.toLowerCase();
    switch (filterBy) {
      case "department":
        return dept.name.toLowerCase().includes(searchValue);
      case "location":
        return dept.location.toLowerCase().includes(searchValue);
      case "leader":
        return (
          dept.leader?.first_name?.toLowerCase().includes(searchValue) ||
          dept.leader?.last_name?.toLowerCase().includes(searchValue)
        );
      default:
        return true;
    }
  });

  const sortedDepartments = filteredDepartments?.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "leader") {
      aValue = `${a.leader?.first_name || ""} ${a.leader?.last_name || ""}`;
      bValue = `${b.leader?.first_name || ""} ${b.leader?.last_name || ""}`;
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <TeamFilter
          filter={filter}
          filterBy={filterBy}
          onFilterChange={setFilter}
          onFilterByChange={setFilterBy}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DepartmentTable
          departments={sortedDepartments}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      <TeamActions />
    </div>
  );
};

export default TeamManagement;