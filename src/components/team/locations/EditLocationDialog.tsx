import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";

interface Location {
  id: string;
  facility_name: string;
  physical_address: string;
  physical_city: string;
  physical_state: string;
  physical_zip: string;
  physical_country: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  primary_contact_id: string | null;
}

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