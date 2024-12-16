import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { TrainingMaterialsList } from "./TrainingMaterialsList";
import { AddMaterialDialog } from "./AddMaterialDialog";

export const TrainingMaterials = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
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

  const handleSubmit = async (material: any, file: File | null) => {
    try {
      setIsLoading(true);

      // Get user's company_id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!profileData?.company_id) {
        throw new Error('Company ID not found');
      }

      let attachmentUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `training/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('Knowledge')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('Knowledge')
          .getPublicUrl(fileName);

        attachmentUrl = publicUrl;
      }

      const { error } = await supabase
        .from("company_training_materials")
        .insert({
          title: material.title,
          content: material.content,
          category: material.category,
          company_id: profileData.company_id,
          created_by: user?.id,
          attachment_url: attachmentUrl || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training material added successfully",
      });

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
        <h2 className="text-lg font-semibold">Train the Model</h2>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>
      <TrainingMaterialsList materials={materials} />
      <AddMaterialDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Card>
  );
};