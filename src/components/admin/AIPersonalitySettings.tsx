import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AIPersonalityForm } from "./AIPersonalityForm";
import { AIPersonalitiesTable } from "./AIPersonalitiesTable";
import { AIPersonality } from "./types";

const defaultPersonalities = [
  {
    name: "Polaris",
    description: "Smart and fast, but blurts answers",
    provider: "anthropic",
    system_prompt: `I am Polaris, a direct and efficient AI assistant. I specialize in:
1. Quick, concise responses
2. Getting straight to the point
3. Practical, actionable advice
4. Clear step-by-step instructions
5. No unnecessary pleasantries`
  },
  {
    name: "Faraday",
    description: "Takes time to pull answers together",
    provider: "perplexity",
    system_prompt: `I am Faraday, a thoughtful and analytical AI assistant. My approach is:
1. Thorough analysis before responding
2. Consideration of multiple perspectives
3. Evidence-based reasoning
4. Detailed explanations
5. Methodical problem-solving`
  },
  {
    name: "Maggie",
    description: "Efficient and gets work done quick",
    provider: "groq",
    system_prompt: `I am Maggie, a results-oriented AI assistant. I focus on:
1. Practical solutions
2. Efficiency in execution
3. Clear action items
4. Time-saving strategies
5. Getting things done`
  },
  {
    name: "Magnes",
    description: "The artistic one",
    provider: "openai",
    system_prompt: `I am Magnes, a creative and imaginative AI assistant. I excel at:
1. Creative problem-solving
2. Visual and artistic thinking
3. Innovative approaches
4. Design-oriented solutions
5. Thinking outside the box`
  }
];

export const AIPersonalitySettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: personalities, refetch } = useQuery({
    queryKey: ["ai-personalities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_personalities")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // If no personalities exist, create the default ones
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from("ai_personalities")
          .insert(defaultPersonalities);

        if (insertError) throw insertError;
        
        const { data: newData, error: refetchError } = await supabase
          .from("ai_personalities")
          .select("*")
          .order("created_at", { ascending: true });
          
        if (refetchError) throw refetchError;
        return newData as AIPersonality[];
      }
      
      return data as AIPersonality[];
    },
  });

  const handleSubmit = async (formData: Omit<AIPersonality, "id">) => {
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
        const { error } = await supabase
          .from("ai_personalities")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "AI personality created successfully",
        });
      }

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
      <AIPersonalityForm
        initialData={editingId ? personalities?.find(p => p.id === editingId) : undefined}
        onSubmit={handleSubmit}
        onCancel={editingId ? () => setEditingId(null) : undefined}
        isSubmitting={isSubmitting}
      />

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">AI Personalities</h3>
        <AIPersonalitiesTable
          personalities={personalities || []}
          onEdit={(personality) => setEditingId(personality.id)}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
};