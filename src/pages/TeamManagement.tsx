import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamActions } from "@/components/team/TeamActions";
import { TeamFilter } from "@/components/team/TeamFilter";
import { DepartmentTable } from "@/components/team/DepartmentTable";
import { EmployeeTable } from "@/components/team/EmployeeTable";
import { AddEmployeeDialog } from "@/components/team/AddEmployeeDialog";
import { Database } from "@/integrations/supabase/types";

type Workcenter = Database["public"]["Tables"]["workcenters"]["Row"];

const TeamManagement = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("department");
  const [sortField, setSortField] = useState("employee_number");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: workcenters, isLoading: isLoadingWorkcenters } = useQuery({
    queryKey: ["workcenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workcenters")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", sortField, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          profile:profiles(first_name, last_name),
          manager:employees(
            profile:profiles(first_name, last_name)
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

  const filteredEmployees = employees?.filter((employee) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();
    const fullName = `${employee.profile.first_name} ${employee.profile.last_name}`.toLowerCase();

    switch (filterBy) {
      case "name":
        return fullName.includes(searchTerm);
      case "employee_number":
        return employee.employee_number.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="workcenters">
        <TabsList>
          <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="workcenters">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Work Centers</h1>
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

            {isLoadingWorkcenters ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <DepartmentTable
                  departments={filteredWorkcenters || []}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Employees</h1>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <TeamFilter
                filter={filter}
                filterBy={filterBy}
                onFilterChange={setFilter}
                onFilterByChange={setFilterBy}
              />
              <AddEmployeeDialog />
            </div>

            {isLoadingEmployees ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <EmployeeTable
                  employees={filteredEmployees || []}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;