import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceScheduleList } from "./MaintenanceScheduleList";
import { Database, Settings, CheckSquare, Calendar, Clock } from "lucide-react";

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
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    ID
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Equipment
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Maintenance Performed
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Next Due
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {equipment?.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{item.id.slice(0, 8)}</td>
                  <td className="p-2">{item.make} {item.model}</td>
                  <td className="p-2">
                    {item.last_maintenance_date ? 'Yes' : 'No'}
                  </td>
                  <td className="p-2">
                    {item.last_maintenance_date ? 
                      new Date(item.last_maintenance_date).toLocaleDateString() : 
                      'N/A'}
                  </td>
                  <td className="p-2">
                    {item.next_maintenance_date ? 
                      new Date(item.next_maintenance_date).toLocaleDateString() : 
                      'Not Scheduled'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};