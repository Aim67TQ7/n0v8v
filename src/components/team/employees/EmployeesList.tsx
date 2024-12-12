import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface Employee {
  id: string;
  employee_number: string;
  start_date: string;
  profile: {
    first_name: string;
    last_name: string;
  };
  manager?: {
    profile: {
      first_name: string;
      last_name: string;
    };
  };
}

interface EmployeesListProps {
  employees: Employee[];
}

export const EmployeesList = ({ employees }: EmployeesListProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee",
      });
    } else {
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'superuser';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.employee_number}</TableCell>
              <TableCell>
                {employee.profile.first_name} {employee.profile.last_name}
              </TableCell>
              <TableCell>
                {employee.manager ? (
                  `${employee.manager.profile.first_name} ${employee.manager.profile.last_name}`
                ) : (
                  "Not assigned"
                )}
              </TableCell>
              <TableCell>{new Date(employee.start_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this employee? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(employee.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedEmployee && (
        <EditEmployeeDialog
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};