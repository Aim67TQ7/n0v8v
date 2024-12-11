import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface AIPersonality {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  system_prompt: string;
}

export const AIPersonalitySettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "",
    system_prompt: "",
  });

  const { data: personalities, refetch } = useQuery({
    queryKey: ["ai-personalities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_personalities")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as AIPersonality[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("ai_personalities")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "AI personality updated successfully",
        });
      } else {
        const { error } = await supabase.from("ai_personalities").insert([
          {
            ...formData,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "AI personality created successfully",
        });
      }

      setFormData({
        name: "",
        description: "",
        provider: "",
        system_prompt: "",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save AI personality",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (personality: AIPersonality) => {
    setEditingId(personality.id);
    setFormData({
      name: personality.name,
      description: personality.description || "",
      provider: personality.provider,
      system_prompt: personality.system_prompt,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ai_personalities")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI personality deleted successfully",
      });
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to delete AI personality",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit AI Personality" : "Create New AI Personality"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <Input
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              System Prompt
            </label>
            <Textarea
              value={formData.system_prompt}
              onChange={(e) =>
                setFormData({ ...formData, system_prompt: e.target.value })
              }
              required
              rows={5}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"} Personality
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  provider: "",
                  system_prompt: "",
                });
              }}
            >
              Cancel
            </Button>
          )}
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">AI Personalities</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalities?.map((personality) => (
              <TableRow key={personality.id}>
                <TableCell>{personality.name}</TableCell>
                <TableCell>{personality.description}</TableCell>
                <TableCell>{personality.provider}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(personality)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(personality.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};