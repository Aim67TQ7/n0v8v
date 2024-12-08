import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { AddWorkCenterDialog } from "./AddWorkCenterDialog";

export const TeamActions = () => {
  return (
    <div className="mt-6 flex gap-4">
      <AddWorkCenterDialog />
      <Button variant="outline" className="gap-2">
        <Edit className="h-4 w-4" /> Update Work Center
      </Button>
    </div>
  );
};