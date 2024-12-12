import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { EditLocationDialog } from "./EditLocationDialog";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  primary_contact: {
    profile: {
      first_name: string;
      last_name: string;
    };
  } | null;
}

interface LocationsListProps {
  locations: Location[];
}

export const LocationsList = ({ locations }: LocationsListProps) => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete location",
      });
    } else {
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility Name</TableHead>
            <TableHead>Physical Address</TableHead>
            <TableHead>Shipping Address</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell className="font-medium">{location.facility_name}</TableCell>
              <TableCell>
                {location.physical_address}<br />
                {location.physical_city}, {location.physical_state} {location.physical_zip}<br />
                {location.physical_country}
              </TableCell>
              <TableCell>
                {location.shipping_address ? (
                  <>
                    {location.shipping_address}<br />
                    {location.shipping_city}, {location.shipping_state} {location.shipping_zip}<br />
                    {location.shipping_country}
                  </>
                ) : (
                  "Same as physical"
                )}
              </TableCell>
              <TableCell>
                {location.primary_contact ? (
                  `${location.primary_contact.profile.first_name} ${location.primary_contact.profile.last_name}`
                ) : (
                  "Not assigned"
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Location</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this location? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(location.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedLocation && (
        <EditLocationDialog
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};