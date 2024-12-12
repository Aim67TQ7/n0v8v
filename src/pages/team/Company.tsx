import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Edit2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

const Company = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_phone: "",
    contact_email: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
    billing_country: "",
    tax_id: "",
    website: "",
    industry: "",
    business_type: "",
    tax_exempt: false
  });

  const { data: companyDetails, isLoading } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_details")
        .select("*")
        .single();

      if (error) throw error;
      setFormData(data || formData);
      return data;
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tax_exempt: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("company_details")
        .update(formData)
        .eq("id", companyDetails?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company details updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Company Details</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone || ""}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type</Label>
              <Input
                id="business_type"
                name="business_type"
                value={formData.business_type || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                name="tax_id"
                value={formData.tax_id || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="tax_exempt"
                checked={formData.tax_exempt}
                onCheckedChange={handleSwitchChange}
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
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_city">City</Label>
                <Input
                  id="billing_city"
                  name="billing_city"
                  value={formData.billing_city || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_state">State</Label>
                <Input
                  id="billing_state"
                  name="billing_state"
                  value={formData.billing_state || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_zip">ZIP Code</Label>
                <Input
                  id="billing_zip"
                  name="billing_zip"
                  value={formData.billing_zip || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_country">Country</Label>
                <Input
                  id="billing_country"
                  name="billing_country"
                  value={formData.billing_country || ""}
                  onChange={handleInputChange}
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
      </Card>
    </div>
  );
};

export default Company;