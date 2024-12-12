import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkCenterForm } from "./WorkCenterForm";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const AddWorkCenterDialog = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Only show add button for admins and superusers
  if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Work Center
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Work Center</DialogTitle>
        </DialogHeader>
        <WorkCenterForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};