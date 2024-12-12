import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceScheduleList } from "./MaintenanceScheduleList";

export const EquipmentList = () => {
  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          maintenance_schedules (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading equipment...</div>;
  }

  return (
    <div className="space-y-6">
      {equipment?.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start gap-4">
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt={`${item.make} ${item.model}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {item.make} {item.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                Type: {item.equipment_type}
              </p>
              <p className="text-sm text-muted-foreground">
                Manufacturer: {item.manufacturer}
              </p>
              <div className="mt-4">
                <MaintenanceScheduleList schedules={item.maintenance_schedules} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};