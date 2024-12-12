import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit2, Save } from "lucide-react";

interface CompanyFormData {
  name: string;
  contact_phone: string;
  contact_email: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  tax_id: string;
  website: string;
  industry: string;
  business_type: string;
  tax_exempt: boolean;
}

interface CompanyFormProps {
  formData: CompanyFormData;
  isEditing: boolean;
  onEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (checked: boolean) => void;
}

export const CompanyForm = ({
  formData,
  isEditing,
  onEdit,
  onSubmit,
  onChange,
  onSwitchChange,
}: CompanyFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            value={formData.contact_phone || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type">Business Type</Label>
          <Input
            id="business_type"
            name="business_type"
            value={formData.business_type || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_id">Tax ID</Label>
          <Input
            id="tax_id"
            name="tax_id"
            value={formData.tax_id || ""}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="tax_exempt"
            checked={formData.tax_exempt}
            onCheckedChange={onSwitchChange}
            disabled={!isEditing}
          />
          <Label htmlFor="tax_exempt">Tax Exempt</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="billing_address">Street Address</Label>
            <Input
              id="billing_address"
              name="billing_address"
              value={formData.billing_address || ""}
              onChange={onChange}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing_city">City</Label>
            <Input
              id="billing_city"
              name="billing_city"
              value={formData.billing_city || ""}
              onChange={onChange}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing_state">State</Label>
            <Input
              id="billing_state"
              name="billing_state"
              value={formData.billing_state || ""}
              onChange={onChange}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing_zip">ZIP Code</Label>
            <Input
              id="billing_zip"
              name="billing_zip"
              value={formData.billing_zip || ""}
              onChange={onChange}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing_country">Country</Label>
            <Input
              id="billing_country"
              name="billing_country"
              value={formData.billing_country || ""}
              onChange={onChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      )}
    </form>
  );
};