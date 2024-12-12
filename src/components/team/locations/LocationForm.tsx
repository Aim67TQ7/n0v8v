import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AddressFields } from "./forms/AddressFields";
import { ContactSelect } from "./forms/ContactSelect";
import { LocationFormData } from "./types";

interface LocationFormProps {
  location?: LocationFormData;
  onSuccess: () => void;
}

export const LocationForm = ({ location, onSuccess }: LocationFormProps) => {
  const { toast } = useToast();
  const [sameAsPhysical, setSameAsPhysical] = useState(!location?.shipping_address);
  const { register, handleSubmit } = useForm<LocationFormData>({
    defaultValues: location || {
      facility_name: "",
      physical_address: "",
      physical_city: "",
      physical_state: "",
      physical_zip: "",
      physical_country: "",
      shipping_address: "",
      shipping_city: "",
      shipping_state: "",
      shipping_zip: "",
      shipping_country: "",
      primary_contact_id: "",
    },
  });

  const onSubmit = async (data: LocationFormData) => {
    if (sameAsPhysical) {
      data.shipping_address = data.physical_address;
      data.shipping_city = data.physical_city;
      data.shipping_state = data.physical_state;
      data.shipping_zip = data.physical_zip;
      data.shipping_country = data.physical_country;
    }

    const { error } = location
      ? await supabase
          .from("locations")
          .update(data)
          .eq("id", location.id)
      : await supabase
          .from("locations")
          .insert([data]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save location",
      });
    } else {
      toast({
        title: "Success",
        description: `Location ${location ? "updated" : "created"} successfully`,
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="facility_name">Facility Name</Label>
          <Input
            id="facility_name"
            {...register("facility_name", { required: true })}
          />
        </div>

        <ContactSelect 
          register={register} 
          defaultValue={location?.primary_contact_id}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Physical Address</h3>
        <AddressFields register={register} prefix="physical" required={true} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="same_as_physical"
          checked={sameAsPhysical}
          onCheckedChange={setSameAsPhysical}
        />
        <Label htmlFor="same_as_physical">Shipping address same as physical</Label>
      </div>

      {!sameAsPhysical && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          <AddressFields register={register} prefix="shipping" />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">
          {location ? "Save Changes" : "Add Location"}
        </Button>
      </div>
    </form>
  );
};