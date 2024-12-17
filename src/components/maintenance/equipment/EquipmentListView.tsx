import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { MaintenanceIcons } from "../icons/MaintenanceIcons";
import { MaintenanceTableHeader } from "../table/MaintenanceTableHeader";
import { addMonths, format } from "date-fns";

export const EquipmentListView = () => {
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

  const columns = [
    { icon: MaintenanceIcons.Equipment, label: "ID" },
    { icon: MaintenanceIcons.Settings, label: "Equipment" },
    { icon: MaintenanceIcons.Maintenance, label: "Maintenance Required" },
    { icon: MaintenanceIcons.Checkbox, label: "Maintenance Performed" },
    { icon: MaintenanceIcons.Calendar, label: "Date" },
    { icon: MaintenanceIcons.Clock, label: "Next Due" }
  ];

  if (isLoading) {
    return <div>Loading equipment...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <MaintenanceTableHeader columns={columns} />
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