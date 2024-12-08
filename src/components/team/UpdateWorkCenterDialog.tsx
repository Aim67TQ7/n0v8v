import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Workcenter = Database["public"]["Tables"]["workcenters"]["Row"];

interface UpdateWorkCenterDialogProps {
  workcenter: Workcenter;
}

export const UpdateWorkCenterDialog = ({ workcenter }: UpdateWorkCenterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(workcenter.name);
  const [department, setDepartment] = useState(workcenter.department);
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update a work center",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("workcenters")
        .update({
          name,
          department,
        })
        .eq('id', workcenter.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work center updated successfully",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workcenters"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Work Center</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Work Center Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter work center name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department name"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Update Work Center
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};