import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        // If it's any error other than "no rows returned", throw it
        throw companyError;
      }

      let demoCompanyId;

      if (!demoCompany) {
        try {
          // Try to create the DEMO company
          const { data: newCompany, error: createError } = await supabase.rpc(
            "create_licensed_company",
            {
              company_name: "DEMO",
              license_type: "demo",
              max_users: 1
            }
          );
          
          if (createError) throw createError;
          demoCompanyId = newCompany;
        } catch (createError: any) {
          if (createError.message?.includes('companies_name_key')) {
            // If creation failed due to duplicate name, try fetching again
            const { data: existingCompany, error: fetchError } = await supabase
              .from("companies")
              .select("id")
              .eq("name", "DEMO")
              .single();
            
            if (fetchError) throw fetchError;
            demoCompanyId = existingCompany.id;
          } else {
            throw createError;
          }
        }
      } else {
        demoCompanyId = demoCompany.id;
      }

      // Create or update the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password
        options: {
          data: {
            first_name: "Demo",
            last_name: "User",
          },
        },
      });

      if (authError) throw authError;

      // Update the profile with demo access
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          company_id: demoCompanyId,
          role: "admin",
          demo_access_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", authData.user!.id);

      if (profileError) throw profileError;

      toast({
        title: "Demo Access Granted",
        description: "Check your email to verify your account. You'll have 24 hours of full access.",
      });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Get Demo Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to get 24-hour full access to the platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleDemoAccess}>
          <div>
            <Input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Get Demo Access"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;