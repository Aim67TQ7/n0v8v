import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface WorkCenterFormData {
  id?: string;
  name: string;
  department: string;
}

interface WorkCenterFormProps {
  workcenter?: {
    id: string;
    name: string;
    department: string;
  };
  onSuccess: () => void;
}

export const WorkCenterForm = ({ workcenter, onSuccess }: WorkCenterFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<WorkCenterFormData>({
    defaultValues: workcenter || {
      name: "",
      department: "",
    },
  });

  const onSubmit = async (data: WorkCenterFormData) => {
    const { error } = workcenter
      ? await supabase
          .from("workcenters")
          .update(data)
          .eq("id", workcenter.id)
      : await supabase
          .from("workcenters")
          .insert([data]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save work center",
      });
    } else {
      toast({
        title: "Success",
        description: `Work center ${workcenter ? "updated" : "created"} successfully`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Work Center Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register("department", { required: true })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {workcenter ? "Save Changes" : "Add Work Center"}
        </Button>
      </div>
    </form>
  );
};