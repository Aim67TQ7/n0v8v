import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeTable } from "./EmployeeTable";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export interface Employee {
  id: string;
  employee_number: string;
  start_date: string;
  company_id: string | null;
  created_at: string;
  manager_id: string | null;
  profile_id: string | null;
  profile: {
    first_name: string;
    last_name: string;
  };
  manager?: {
    profile: {
      first_name: string;
      last_name: string;
    };
  } | null;
}

export const EmployeeTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: employeesData, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_number,
          start_date,
          company_id,
          created_at,
          manager_id,
          profile_id,
          profile:profiles(first_name, last_name),
          manager:employees!employees_manager_id_fkey(
            profile:profiles(first_name, last_name)
          )
        `);

      if (error) throw error;

      if (employeesData) {
        setEmployees(employeesData as Employee[]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EmployeeTable employees={employees} />
    </div>
  );
};