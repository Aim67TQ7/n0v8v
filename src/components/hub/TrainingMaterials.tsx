import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

export const TrainingMaterials = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    content: "",
    category: "",
  });
  const { toast } = useToast();

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("company_training_materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast({
        title: "Error",
        description: "Failed to load training materials",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get user's company_id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!profileData?.company_id) {
        throw new Error('Company ID not found');
      }

      const { error } = await supabase
        .from("company_training_materials")
        .insert({
          title: newMaterial.title,
          content: newMaterial.content,
          category: newMaterial.category,
          company_id: profileData.company_id,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training material added successfully",
      });

      setNewMaterial({ title: "", content: "", category: "" });
      setIsDialogOpen(false);
      loadMaterials();
    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Error",
        description: "Failed to add training material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Training Materials</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Training Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={newMaterial.title}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Category"
                  value={newMaterial.category}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, category: e.target.value })
                  }
                />
              </div>
              <div>
                <Textarea
                  placeholder="Content"
                  value={newMaterial.content}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, content: e.target.value })
                  }
                  rows={5}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Material"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {materials.map((material) => (
          <Card key={material.id} className="p-3">
            <h3 className="font-medium">{material.title}</h3>
            <p className="text-sm text-gray-500">{material.category}</p>
            <p className="text-sm mt-2">{material.content}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};