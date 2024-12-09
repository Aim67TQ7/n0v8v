import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";

const CompanyGPT = () => {
  useEffect(() => {
    const setupDemoCompany = async () => {
      try {
        const { data: demoCompany } = await supabase
          .from("companies")
          .select("id")
          .eq("name", "DEMO")
          .single();

        if (!demoCompany) {
          const { data: newCompany } = await supabase.rpc("create_licensed_company", {
            company_name: "DEMO",
            license_type: "demo",
            max_users: 1000
          });
          console.log("Created demo company:", newCompany);
        }
      } catch (error) {
        console.error("Error setting up demo company:", error);
      }
    };

    setupDemoCompany();
  }, []);

  return (
    <div className="flex h-screen">
      <ResourceSidebar />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
};

export default CompanyGPT;