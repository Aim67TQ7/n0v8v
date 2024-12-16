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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const NewsForm = ({ onNewsAdded }: { onNewsAdded: () => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", content: "" });
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's company ID
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.company_id) {
      toast({
        title: "Error",
        description: "Unable to determine your company. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("company_news")
        .insert({
          title: newNews.title,
          content: newNews.content,
          company_id: profile.company_id,
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
          <DialogDescription>
            Create a new announcement for your company.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              value={newNews.title}
              onChange={(e) =>
                setNewNews({ ...newNews, title: e.target.value })
              }
              required
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
              required
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