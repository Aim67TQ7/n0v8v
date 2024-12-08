import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamFilter } from "./TeamFilter";
import { EmployeeTable } from "./EmployeeTable";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

export const EmployeeTab = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [employeeSortField, setEmployeeSortField] = useState("employee_number");
  const [employeeSortDirection, setEmployeeSortDirection] = useState<"asc" | "desc">("asc");

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", employeeSortField, employeeSortDirection],
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
        .order(employeeSortField, { ascending: employeeSortDirection === "asc" });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleEmployeeSort = (field: string) => {
    if (field === employeeSortField) {
      setEmployeeSortDirection(employeeSortDirection === "asc" ? "desc" : "asc");
    } else {
      setEmployeeSortField(field);
      setEmployeeSortDirection("asc");
    }
  };

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
            sortField={employeeSortField}
            sortDirection={employeeSortDirection}
            onSort={handleEmployeeSort}
          />
        </div>
      )}
    </div>
  );
};