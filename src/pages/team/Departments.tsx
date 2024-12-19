import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";
import { AuthWrapper } from "@/components/AuthWrapper";
import { DepartmentsList } from "@/components/team/departments/DepartmentsList";
import { DepartmentFilter } from "@/components/team/departments/DepartmentFilter";
import { AddDepartmentDialog } from "@/components/team/departments/AddDepartmentDialog";

const Departments = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          leader:profiles(first_name, last_name)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredDepartments = departments?.filter((department) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "name":
        return department.name.toLowerCase().includes(searchTerm);
      case "location":
        return department.location.toLowerCase().includes(searchTerm);
      case "accounting_code":
        return department.accounting_code?.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Departments</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <DepartmentFilter
              filter={filter}
              filterBy={filterBy}
              onFilterChange={setFilter}
              onFilterByChange={setFilterBy}
            />
            <AddDepartmentDialog />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <DepartmentsList departments={filteredDepartments || []} />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Departments;