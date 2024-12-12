import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface CompanyFormData {
  id?: string;
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
  submission_status?: string;
}

const initialFormData: CompanyFormData = {
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

export const useCompanyDetails = () => {
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

  return {
    formData,
    isEditing,
    isLoading,
    setIsEditing,
    handleSubmit,
    handleInputChange,
    handleSwitchChange,
    user
  };
};