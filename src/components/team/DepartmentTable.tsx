import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { UpdateWorkCenterDialog } from "./UpdateWorkCenterDialog";

type Workcenter = Database["public"]["Tables"]["workcenters"]["Row"];

interface DepartmentTableProps {
  departments: Workcenter[];
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
              Work Center
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("department")}>
            <div className="flex items-center gap-2">
              Department
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments?.map((workcenter) => (
          <TableRow key={workcenter.id} className="hover:bg-gray-50">
            <TableCell>{workcenter.name}</TableCell>
            <TableCell>{workcenter.department}</TableCell>
            <TableCell>{new Date(workcenter.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <UpdateWorkCenterDialog workcenter={workcenter} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};