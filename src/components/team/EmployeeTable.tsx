import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";
import { UserCheck, GraduationCap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Employee = Database["public"]["Tables"]["employees"]["Row"] & {
  profile: {
    first_name: string;
    last_name: string;
  };
  manager: {
    profile: {
      first_name: string;
      last_name: string;
    };
  };
};

interface EmployeeTableProps {
  employees: Employee[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export const EmployeeTable = ({
  employees,
  sortField,
  sortDirection,
  onSort,
}: EmployeeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort("employee_number")}>
            Employee Number
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
            Name
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("manager")}>
            Manager
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("start_date")}>
            Start Date
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees?.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.employee_number}</TableCell>
            <TableCell>
              {employee.profile.first_name} {employee.profile.last_name}
            </TableCell>
            <TableCell>
              {employee.manager?.profile.first_name} {employee.manager?.profile.last_name}
            </TableCell>
            <TableCell>{new Date(employee.start_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/team/training/${employee.id}`}>
                    <GraduationCap className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/team/skills/${employee.id}`}>
                    <UserCheck className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/team/kpi/${employee.id}`}>
                    <Target className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};