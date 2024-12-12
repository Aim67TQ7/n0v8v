import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Edit2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyForm } from "@/components/company/CompanyForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const initialFormData = {
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
};

const Company = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // First get the user's profile to get their company_id
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Then get the company details using the company_id
  const { data: companyDetails, isLoading } = useQuery({
    queryKey: ["companyDetails", profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_details")
        .select("*")
        .eq("id", profile?.company_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no data exists yet, return null
      if (!data) return null;
      
      // Update form data with company details
      setFormData({
        name: data.name || "",
        contact_phone: data.contact_phone || "",
        contact_email: data.contact_email || "",
        billing_address: data.billing_address || "",
        billing_city: data.billing_city || "",
        billing_state: data.billing_state || "",
        billing_zip: data.billing_zip || "",
        billing_country: data.billing_country || "",
        tax_id: data.tax_id || "",
        website: data.website || "",
        industry: data.industry || "",
        business_type: data.business_type || "",
        tax_exempt: data.tax_exempt || false
      });
      
      return data;
    },
    enabled: !!profile?.company_id
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        .upsert({ // Use upsert instead of update
          id: profile?.company_id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company details updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating company details:', error);
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
        <CompanyForm
          formData={formData}
          isEditing={isEditing}
          onEdit={() => setIsEditing(!isEditing)}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onSwitchChange={handleSwitchChange}
        />
      </Card>
    </div>
  );
};

export default Company;