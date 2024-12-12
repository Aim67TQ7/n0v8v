import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WorkcenterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const WorkcenterSelect = ({ value, onChange }: WorkcenterSelectProps) => {
  const { data: workcenters, isLoading } = useQuery({
    queryKey: ['workcenters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workcenters')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Workcenter</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a workcenter" />
        </SelectTrigger>
        <SelectContent>
          {workcenters?.map((wc) => (
            <SelectItem key={wc.id} value={wc.id}>
              {wc.name} - {wc.department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};