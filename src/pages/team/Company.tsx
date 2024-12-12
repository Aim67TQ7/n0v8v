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
  tax_exempt: false,
  submission_status: "draft"
};

const Company = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(!user);
  const [formData, setFormData] = useState(initialFormData);

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

  const { data: companyDetails, isLoading } = useQuery({
    queryKey: ["companyDetails", profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_details")
        .select("*")
        .eq("id", profile?.company_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          ...initialFormData,
          ...data
        });
      }
      
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
      if (!user) {
        // For public submissions, first create a company
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: formData.name,
            status: 'pending'
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Then create company details with the new company ID
        const { error: detailsError } = await supabase
          .from("company_details")
          .insert({
            id: companyData.id,
            ...formData,
            submission_status: 'submitted'
          });

        if (detailsError) throw detailsError;

        toast({
          title: "Success",
          description: "Your company information has been submitted. Our team will contact you shortly.",
        });
        setIsEditing(false);
      } else {
        // For logged-in users
        const { error } = await supabase
          .from("company_details")
          .upsert({
            id: profile?.company_id,
            ...formData,
            submission_status: 'active'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company details updated successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating company details:', error);
      toast({
        title: "Error",
        description: "Failed to update company details",
        variant: "destructive",
      });
    }
  };

  if (isLoading && user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">
            {user ? "Company Details" : "Register Your Company"}
          </h1>
        </div>
        {user && (
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
        )}
      </div>

      {!user && (
        <div className="mb-6 text-muted-foreground">
          Fill out your company information below to get started. Our team will review your submission
          and contact you shortly, or you can proceed to purchase a license immediately after submission.
        </div>
      )}

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