import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Employee } from "@/components/team/EmployeeTab";
import { EmployeeTable } from "@/components/team/EmployeeTable";

export default function Employees() {
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Employees</h2>
      <EmployeeTable employees={employees} />
    </Card>
  );
}