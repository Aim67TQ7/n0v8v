import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const NewsForm = ({ onNewsAdded }: { onNewsAdded: () => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", content: "" });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user?.id)
        .single();

      if (profileError || !profileData?.company_id) {
        throw new Error('Company ID not found');
      }

      const { error } = await supabase
        .from("company_news")
        .insert({
          title: newNews.title,
          content: newNews.content,
          company_id: profileData.company_id,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "News item added successfully",
      });

      setNewNews({ title: "", content: "" });
      setIsDialogOpen(false);
      onNewsAdded();
    } catch (error) {
      console.error('Error adding news:', error);
      toast({
        title: "Error",
        description: "Failed to add news item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company News</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              value={newNews.title}
              onChange={(e) =>
                setNewNews({ ...newNews, title: e.target.value })
              }
            />
          </div>
          <div>
            <Textarea
              placeholder="Content"
              value={newNews.content}
              onChange={(e) =>
                setNewNews({ ...newNews, content: e.target.value })
              }
              rows={5}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add News"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};