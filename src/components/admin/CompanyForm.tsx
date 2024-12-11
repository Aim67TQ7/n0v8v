import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type LicenseType = 'basic' | 'premium' | 'enterprise' | 'demo';

export const CompanyForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType>("basic");
  const [maxUsers, setMaxUsers] = useState("5");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCompany = useMutation({
    mutationFn: async () => {
      console.log("Creating company with:", { companyName, licenseType, maxUsers });
      const { data, error } = await supabase.rpc("create_licensed_company", {
        company_name: companyName,
        license_type: licenseType,
        max_users: parseInt(maxUsers),
      });

      if (error) {
        console.error("Error creating company:", error);
        throw error;
      }
      console.log("Company created:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Success",
        description: "Company created successfully",
      });
      setCompanyName("");
      setLicenseType("basic");
      setMaxUsers("5");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create company",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Company name is required",
      });
      return;
    }
    createCompany.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Company Name</label>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">License Type</label>
        <Select value={licenseType} onValueChange={(value: LicenseType) => setLicenseType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select license type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic (5 users)</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="demo">Demo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Max Users</label>
        <Input
          type="number"
          value={maxUsers}
          onChange={(e) => setMaxUsers(e.target.value)}
          min="1"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full gap-2"
        disabled={createCompany.isPending}
      >
        <Plus className="h-4 w-4" />
        {createCompany.isPending ? "Creating..." : "Create Company"}
      </Button>
    </form>
  );
};