import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";
import { Location } from "./types";

interface EditLocationDialogProps {
  location: Location;
  onClose: () => void;
}

export const EditLocationDialog = ({ location, onClose }: EditLocationDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        <LocationForm location={location} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};