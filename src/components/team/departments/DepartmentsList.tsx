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
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EditDepartmentDialog } from "./EditDepartmentDialog";
import { useState } from "react";

interface Department {
  id: string;
  name: string;
  location: string;
  accounting_code: string | null;
  leader_id: string | null;
  leader: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface DepartmentsListProps {
  departments: Department[];
}

export const DepartmentsList = ({ departments }: DepartmentsListProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete department",
      });
    } else {
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Accounting Code</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell>
                <Link 
                  to={`/team/locations`} 
                  className="text-blue-600 hover:underline"
                >
                  {department.location}
                </Link>
              </TableCell>
              <TableCell>{department.accounting_code}</TableCell>
              <TableCell>
                {department.leader ? (
                  <Link 
                    to={`/team/employees`} 
                    className="text-blue-600 hover:underline"
                  >
                    {department.leader.first_name} {department.leader.last_name}
                  </Link>
                ) : (
                  "Not assigned"
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDepartment(department)}
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
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this department? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(department.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedDepartment && (
        <EditDepartmentDialog
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </div>
  );
};