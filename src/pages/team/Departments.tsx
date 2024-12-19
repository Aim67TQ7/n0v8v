import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DepartmentsList } from "@/components/team/departments/DepartmentsList";
import { AddDepartmentDialog } from "@/components/team/departments/AddDepartmentDialog";
import { DepartmentFilter } from "@/components/team/departments/DepartmentFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Departments = () => {
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          leader:profiles(
            first_name,
            last_name
          )
        `);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <AddDepartmentDialog />
      </div>
      
      <Card className="p-6">
        <DepartmentFilter 
          filter={filter}
          filterBy={filterBy}
          onFilterChange={setFilter}
          onFilterByChange={setFilterBy}
        />
        <DepartmentsList departments={departments} />
      </Card>
    </div>
  );
};

export default Departments;