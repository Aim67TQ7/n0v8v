import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeForm } from "./EmployeeForm";

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

interface EditEmployeeDialogProps {
  employee: Employee;
  onClose: () => void;
}

export const EditEmployeeDialog = ({ employee, onClose }: EditEmployeeDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <EmployeeForm employee={employee} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};