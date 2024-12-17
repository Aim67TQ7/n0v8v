import { LucideIcon } from "lucide-react";

interface MaintenanceColumnHeader {
  icon: LucideIcon;
  label: string;
}

interface MaintenanceTableHeaderProps {
  columns: MaintenanceColumnHeader[];
}

export const MaintenanceTableHeader = ({ columns }: MaintenanceTableHeaderProps) => {
  return (
    <tr className="border-b">
      {columns.map(({ icon: Icon, label }, index) => (
        <th key={index} className="text-left p-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </div>
        </th>
      ))}
    </tr>
  );
};