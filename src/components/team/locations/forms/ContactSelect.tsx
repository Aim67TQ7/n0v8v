import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { LocationFormData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContactSelectProps {
  register: UseFormRegister<LocationFormData>;
  defaultValue?: string;
}

export const ContactSelect = ({ register, defaultValue }: ContactSelectProps) => {
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

  return (
    <div className="space-y-2">
      <Label htmlFor="primary_contact_id">Primary Contact</Label>
      <Select
        onValueChange={(value) => register("primary_contact_id").onChange({ target: { value } })}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a contact" />
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
  );
};