import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisType {
  id: string;
  name: string;
  description: string | null;
}

interface AnalysisTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AnalysisTypeSelect = ({ value, onChange }: AnalysisTypeSelectProps) => {
  const { data: inspectionTypes } = useQuery<AnalysisType[]>({
    queryKey: ['inspectionTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Inspection Type</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose inspection type" />
        </SelectTrigger>
        <SelectContent>
          {inspectionTypes?.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};