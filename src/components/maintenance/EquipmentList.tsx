import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceScheduleList } from "./MaintenanceScheduleList";
import { Database, Settings, CheckSquare, Calendar, Clock, Tool } from "lucide-react";
import { addMonths, format } from "date-fns";

export const EquipmentList = () => {
  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      // For demonstration, we'll return simulated data
      const simulatedData = [
        {
          id: "EQ001",
          make: "Mazak",
          model: "QT-15",
          maintenance_type: "Spindle Bearing Inspection, Coolant System Cleaning",
          last_maintenance_date: "2024-03-01",
          next_maintenance_date: format(addMonths(new Date("2024-03-01"), 6), 'yyyy-MM-dd')
        },
        {
          id: "EQ002",
          make: "Haas",
          model: "VF-2",
          maintenance_type: "Tool Changer Maintenance, Way Lube System Check",
          last_maintenance_date: "2024-02-15",
          next_maintenance_date: format(addMonths(new Date("2024-02-15"), 6), 'yyyy-MM-dd')
        },
        {
          id: "EQ003",
          make: "DMG MORI",
          model: "NLX 2500",
          maintenance_type: "Hydraulic System Service, Chuck Maintenance",
          last_maintenance_date: "2024-03-10",
          next_maintenance_date: format(addMonths(new Date("2024-03-10"), 6), 'yyyy-MM-dd')
        },
        {
          id: "EQ004",
          make: "Okuma",
          model: "LB3000 EX",
          maintenance_type: "Turret Alignment, Coolant Tank Cleaning",
          last_maintenance_date: "2024-02-28",
          next_maintenance_date: format(addMonths(new Date("2024-02-28"), 6), 'yyyy-MM-dd')
        },
        {
          id: "EQ005",
          make: "Doosan",
          model: "Puma 2600",
          maintenance_type: "Ball Screw Inspection, Lubrication System Check",
          last_maintenance_date: "2024-03-05",
          next_maintenance_date: format(addMonths(new Date("2024-03-05"), 6), 'yyyy-MM-dd')
        }
      ];
      return simulatedData;
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
                    <Tool className="w-4 h-4" />
                    Maintenance Required
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
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.make} {item.model}</td>
                  <td className="p-2">{item.maintenance_type}</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">
                    {new Date(item.last_maintenance_date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {new Date(item.next_maintenance_date).toLocaleDateString()}
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