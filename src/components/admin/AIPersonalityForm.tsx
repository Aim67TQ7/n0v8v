import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AIPersonality } from "./types";

interface AIPersonalityFormProps {
  initialData?: AIPersonality;
  onSubmit: (data: Omit<AIPersonality, "id">) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export const AIPersonalityForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: AIPersonalityFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    provider: initialData?.provider || "",
    system_prompt: initialData?.system_prompt || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? "Edit AI Personality" : "Create New AI Personality"}
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
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Create"} Personality
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};