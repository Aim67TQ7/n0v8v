import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCompanyId } from "@/hooks/useCompanyId";

interface CategoryFormData {
  id?: string;
  name: string;
  description?: string;
}

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  onSuccess: () => void;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { toast } = useToast();
  const companyId = useCompanyId();
  const { register, handleSubmit } = useForm<CategoryFormData>({
    defaultValues: category || {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const { error } = category
      ? await supabase
          .from("categories")
          .update(data)
          .eq("id", category.id)
      : await supabase
          .from("categories")
          .insert([{ ...data, company_id: companyId }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category",
      });
    } else {
      toast({
        title: "Success",
        description: `Category ${category ? "updated" : "created"} successfully`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {category ? "Save Changes" : "Add Category"}
        </Button>
      </div>
    </form>
  );
};