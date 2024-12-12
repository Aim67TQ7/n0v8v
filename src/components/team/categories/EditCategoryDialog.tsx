import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";

interface EditCategoryDialogProps {
  category: {
    id: string;
    name: string;
    description?: string;
  };
  onClose: () => void;
}

export const EditCategoryDialog = ({ category, onClose }: EditCategoryDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};