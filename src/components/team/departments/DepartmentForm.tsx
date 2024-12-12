import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentFormData {
  id?: string;
  name: string;
  location: string;
  accounting_code: string;
  leader_id: string;
}

interface DepartmentFormProps {
  department?: {
    id: string;
    name: string;
    location: string;
    accounting_code: string | null;
    leader_id: string | null;
  };
  onSuccess: () => void;
}

export const DepartmentForm = ({ department, onSuccess }: DepartmentFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm<DepartmentFormData>({
    defaultValues: department || {
      name: "",
      location: "",
      accounting_code: "",
      leader_id: "",
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          profile:profiles(
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    const { error } = department
      ? await supabase
          .from("departments")
          .update(data)
          .eq("id", department.id)
      : await supabase
          .from("departments")
          .insert([data]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save department",
      });
    } else {
      toast({
        title: "Success",
        description: `Department ${department ? "updated" : "created"} successfully`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Department Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accounting_code">Accounting Code</Label>
          <Input
            id="accounting_code"
            {...register("accounting_code")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leader_id">Supervisor</Label>
          <Select
            onValueChange={(value) => setValue("leader_id", value)}
            defaultValue={department?.leader_id || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a supervisor" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.profile.first_name} {employee.profile.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {department ? "Save Changes" : "Add Department"}
        </Button>
      </div>
    </form>
  );
};