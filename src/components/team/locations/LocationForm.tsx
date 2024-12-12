import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface LocationFormData {
  facility_name: string;
  physical_address: string;
  physical_city: string;
  physical_state: string;
  physical_zip: string;
  physical_country: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  primary_contact_id: string;
}

interface LocationFormProps {
  location?: LocationFormData;
  onSuccess: () => void;
}

export const LocationForm = ({ location, onSuccess }: LocationFormProps) => {
  const { toast } = useToast();
  const [sameAsPhysical, setSameAsPhysical] = useState(!location?.shipping_address);
  const { register, handleSubmit, formState: { errors } } = useForm<LocationFormData>({
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

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          profile:profiles(
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      return data;
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

        <div className="space-y-2">
          <Label htmlFor="primary_contact_id">Primary Contact</Label>
          <Select
            onValueChange={(value) => register("primary_contact_id").onChange({ target: { value } })}
            defaultValue={location?.primary_contact_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.profile.first_name} {employee.profile.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Physical Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="physical_address">Street Address</Label>
            <Input
              id="physical_address"
              {...register("physical_address", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical_city">City</Label>
            <Input
              id="physical_city"
              {...register("physical_city", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical_state">State</Label>
            <Input
              id="physical_state"
              {...register("physical_state", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical_zip">ZIP Code</Label>
            <Input
              id="physical_zip"
              {...register("physical_zip", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical_country">Country</Label>
            <Input
              id="physical_country"
              {...register("physical_country", { required: true })}
            />
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shipping_address">Street Address</Label>
              <Input
                id="shipping_address"
                {...register("shipping_address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_city">City</Label>
              <Input
                id="shipping_city"
                {...register("shipping_city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_state">State</Label>
              <Input
                id="shipping_state"
                {...register("shipping_state")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_zip">ZIP Code</Label>
              <Input
                id="shipping_zip"
                {...register("shipping_zip")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_country">Country</Label>
              <Input
                id="shipping_country"
                {...register("shipping_country")}
              />
            </div>
          </div>
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