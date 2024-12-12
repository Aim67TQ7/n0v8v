import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { LocationFormData } from "../types";

interface AddressFieldsProps {
  register: UseFormRegister<LocationFormData>;
  prefix: "physical" | "shipping";
  required?: boolean;
}

export const AddressFields = ({ register, prefix, required = false }: AddressFieldsProps) => {
  const label = prefix === "physical" ? "Physical" : "Shipping";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}_address`}>{label} Street Address</Label>
        <Input
          id={`${prefix}_address`}
          {...register(`${prefix}_address`, { required })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}_city`}>{label} City</Label>
        <Input
          id={`${prefix}_city`}
          {...register(`${prefix}_city`, { required })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}_state`}>{label} State</Label>
        <Input
          id={`${prefix}_state`}
          {...register(`${prefix}_state`, { required })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}_zip`}>{label} ZIP Code</Label>
        <Input
          id={`${prefix}_zip`}
          {...register(`${prefix}_zip`, { required })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}_country`}>{label} Country</Label>
        <Input
          id={`${prefix}_country`}
          {...register(`${prefix}_country`, { required })}
        />
      </div>
    </div>
  );
};