import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LicenseType = 'basic' | 'premium' | 'enterprise' | 'demo';

const AdminPanel = () => {
  const [companyName, setCompanyName] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType>("basic");
  const [maxUsers, setMaxUsers] = useState("5");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing companies
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create company mutation
  const createCompany = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("create_licensed_company", {
        company_name: companyName,
        license_type: licenseType,
        max_users: parseInt(maxUsers),
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Success",
        description: "Company created successfully",
      });
      // Reset form
      setCompanyName("");
      setLicenseType("basic");
      setMaxUsers("5");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany.mutate();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Management</h1>
        <Database className="h-8 w-8 text-gray-400" />
      </div>

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

        <Button type="submit" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Create Company
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Companies</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>Max Users</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell className="capitalize">{company.license_type}</TableCell>
                  <TableCell>{company.max_users}</TableCell>
                  <TableCell>
                    {new Date(company.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;