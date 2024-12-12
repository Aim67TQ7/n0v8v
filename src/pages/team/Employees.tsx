import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { AuthWrapper } from "@/components/AuthWrapper";
import { EmployeesList } from "@/components/team/employees/EmployeesList";
import { EmployeeFilter } from "@/components/team/employees/EmployeeFilter";
import { AddEmployeeDialog } from "@/components/team/employees/AddEmployeeDialog";

const Employees = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
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
        .order('employee_number');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
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
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Employees</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <EmployeeFilter
              filter={filter}
              filterBy={filterBy}
              onFilterChange={setFilter}
              onFilterByChange={setFilterBy}
            />
            <AddEmployeeDialog />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <EmployeesList employees={filteredEmployees || []} />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Employees;