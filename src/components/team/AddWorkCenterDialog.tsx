import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AddWorkCenterDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add a work center",
      });
      return;
    }

    try {
      // Get user's company_id from their profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", session.user.id)
        .single();

      if (!profileData?.company_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No company associated with your profile",
        });
        return;
      }

      const { error } = await supabase.from("workcenters").insert({
        name,
        department,
        company_id: profileData.company_id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work center added successfully",
      });

      // Reset form and close dialog
      setName("");
      setDepartment("");
      setOpen(false);

      // Refresh the departments data
      queryClient.invalidateQueries({ queryKey: ["departments"] });
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Work Center
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Work Center</DialogTitle>
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
            Add Work Center
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};