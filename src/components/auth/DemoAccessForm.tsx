import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const DemoAccessForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if DEMO company exists
      const { data: demoCompany, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("name", "DEMO")
        .single();

      if (companyError && companyError.code !== 'PGRST116') {
        throw companyError;
      }

      let demoCompanyId;

      if (!demoCompany) {
        const { data: newCompany, error: createError } = await supabase.rpc(
          "create_licensed_company",
          {
            company_name: "DEMO",
            license_type: "demo",
            max_users: 1000
          }
        );
        
        if (createError) throw createError;
        demoCompanyId = newCompany;
      } else {
        demoCompanyId = demoCompany.id;
      }

      // Send magic link for passwordless sign in
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            first_name: "Demo",
            last_name: "User",
            company_id: demoCompanyId,
            role: "employee",
            demo_access_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }
        }
      });

      if (signInError) throw signInError;

      toast({
        title: "Demo Access Link Sent",
        description: "Check your email for a magic link to access the demo.",
      });

      // Redirect to DemoGPT page after successful email submission
      navigate("/company-gpt");

    } catch (error: any) {
      console.error("Demo access error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDemoAccess} className="space-y-6">
      <Input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !email}
      >
        {loading ? "Processing..." : "Get Demo Access"}
      </Button>
    </form>
  );
};