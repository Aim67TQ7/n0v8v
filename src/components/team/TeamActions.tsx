import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

export const TeamActions = () => {
  return (
    <div className="mt-6 flex gap-4">
      <Button className="gap-2">
        <Plus className="h-4 w-4" /> Add Work Center
      </Button>
      <Button variant="outline" className="gap-2">
        <Edit className="h-4 w-4" /> Update Work Center
      </Button>
    </div>
  );
};