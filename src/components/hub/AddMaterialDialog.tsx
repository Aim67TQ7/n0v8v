import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddMaterialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (material: any, file: File | null) => Promise<void>;
  isLoading: boolean;
}

export const AddMaterialDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  isLoading 
}: AddMaterialDialogProps) => {
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newMaterial, selectedFile);
    setNewMaterial({ title: "", content: "", category: "" });
    setSelectedFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Train Max</DialogTitle>
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
              placeholder="Content for Max to learn"
              value={newMaterial.content}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, content: e.target.value })
              }
              rows={5}
            />
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {selectedFile ? selectedFile.name : "Attach Document for Max"}
            </Button>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Training Max..." : "Train Max"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};