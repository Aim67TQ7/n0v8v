import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/admin/CompanyForm";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { AIPersonalitySettings } from "@/components/admin/AIPersonalitySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPanel = () => {
  const { data: companies, isLoading, error: fetchError } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies...");
      const { data, error } = await supabase
        .from("companies")
        .select(`
          *,
          details:company_details(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }
      
      console.log("Companies fetched:", data);
      return data;
    },
  });

  if (fetchError) {
    console.error("Fetch error details:", fetchError);
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">
          Error loading companies: {(fetchError as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Database className="h-8 w-8 text-gray-400" />
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="ai-personalities">AI Personalities</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          <CompanyForm />
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Existing Companies</h2>
            <CompaniesTable companies={companies} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="ai-personalities">
          <AIPersonalitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;