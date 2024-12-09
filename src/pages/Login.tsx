import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the DEMO company ID
      const { data: demoCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("license_type", "demo")
        .single();

      if (!demoCompany) {
        throw new Error("Demo company not found");
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
          company_id: demoCompany.id,
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