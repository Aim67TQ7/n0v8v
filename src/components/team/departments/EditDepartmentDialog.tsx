import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DepartmentForm } from "./DepartmentForm";

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

interface EditDepartmentDialogProps {
  department: Department;
  onClose: () => void;
}

export const EditDepartmentDialog = ({ department, onClose }: EditDepartmentDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <DepartmentForm department={department} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};