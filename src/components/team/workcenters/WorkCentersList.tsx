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
import { EditWorkCenterDialog } from "./EditWorkCenterDialog";
import { useState } from "react";

interface WorkCenter {
  id: string;
  name: string;
  department: string;
  created_at: string;
}

interface WorkCentersListProps {
  workcenters: WorkCenter[];
}

export const WorkCentersList = ({ workcenters }: WorkCentersListProps) => {
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('workcenters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete work center",
      });
    } else {
      toast({
        title: "Success",
        description: "Work center deleted successfully",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Work Center Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workcenters.map((workcenter) => (
            <TableRow key={workcenter.id}>
              <TableCell className="font-medium">{workcenter.name}</TableCell>
              <TableCell>{workcenter.department}</TableCell>
              <TableCell>{new Date(workcenter.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedWorkCenter(workcenter)}
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
                        <AlertDialogTitle>Delete Work Center</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this work center? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(workcenter.id)}>
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
      {selectedWorkCenter && (
        <EditWorkCenterDialog
          workcenter={selectedWorkCenter}
          onClose={() => setSelectedWorkCenter(null)}
        />
      )}
    </div>
  );
};