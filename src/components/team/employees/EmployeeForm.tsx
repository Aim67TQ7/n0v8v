import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface EmployeeFormData {
  employee_number: string;
  start_date: string;
  manager_id?: string;
  profile_id?: string;
}

interface EmployeeFormProps {
  employee?: {
    id: string;
    employee_number: string;
    start_date: string;
    manager_id?: string;
    profile_id?: string;
  };
  onSuccess: () => void;
}

export const EmployeeForm = ({ employee, onSuccess }: EmployeeFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<EmployeeFormData>({
    defaultValues: employee || {
      employee_number: "",
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const { data: managers } = useQuery({
    queryKey: ["employees-as-managers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          profile:profiles(first_name, last_name)
        `);

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    const { error } = employee
      ? await supabase
          .from("employees")
          .update(data)
          .eq("id", employee.id)
      : await supabase
          .from("employees")
          .insert([data]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee",
      });
    } else {
      toast({
        title: "Success",
        description: `Employee ${employee ? "updated" : "created"} successfully`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employee_number">Employee Number</Label>
          <Input
            id="employee_number"
            {...register("employee_number", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager_id">Manager</Label>
          <select
            id="manager_id"
            {...register("manager_id")}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a manager</option>
            {managers?.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.profile.first_name} {manager.profile.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {employee ? "Save Changes" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};