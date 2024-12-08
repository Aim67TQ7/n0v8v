import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface DepartmentTableProps {
  departments: any[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export const DepartmentTable = ({
  departments,
  sortField,
  sortDirection,
  onSort,
}: DepartmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
            <div className="flex items-center gap-2">
              Work Station
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("location")}>
            <div className="flex items-center gap-2">
              Location
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("department")}>
            <div className="flex items-center gap-2">
              Department
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("leader")}>
            <div className="flex items-center gap-2">
              Leader
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Team Members</TableHead>
          <TableHead>Labor Rate ($)</TableHead>
          <TableHead>Burden Rate ($)</TableHead>
          <TableHead>Primary Purpose</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments?.map((dept) => (
          <TableRow key={dept.id} className="hover:bg-gray-50">
            <TableCell>{dept.name}</TableCell>
            <TableCell>{dept.location}</TableCell>
            <TableCell>{dept.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {dept.leader?.photo_url && (
                  <img
                    src={dept.leader.photo_url}
                    alt={`${dept.leader.first_name} ${dept.leader.last_name}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span>
                  {dept.leader?.first_name} {dept.leader?.last_name}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex -space-x-2">
                {dept.department_members?.map((member) => (
                  <img
                    key={member.profile.id}
                    src={member.profile.photo_url || "/placeholder.svg"}
                    alt={`${member.profile.first_name} ${member.profile.last_name}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    title={`${member.profile.first_name} ${member.profile.last_name}`}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>${dept.labor_rate || 0}</TableCell>
            <TableCell>${dept.burden_rate || 0}</TableCell>
            <TableCell>{dept.primary_purpose}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};