import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkCenterForm } from "./WorkCenterForm";

interface WorkCenter {
  id: string;
  name: string;
  department: string;
}

interface EditWorkCenterDialogProps {
  workcenter: WorkCenter;
  onClose: () => void;
}

export const EditWorkCenterDialog = ({ workcenter, onClose }: EditWorkCenterDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Work Center</DialogTitle>
        </DialogHeader>
        <WorkCenterForm workcenter={workcenter} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};