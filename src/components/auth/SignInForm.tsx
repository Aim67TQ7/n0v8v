import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState(() => {
    return sessionStorage.getItem("companyLicense") || "";
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!licenseNumber) {
        navigate("/");
        toast({
          variant: "destructive",
          title: "License Required",
          description: "Please obtain a company license to proceed with login.",
        });
        return;
      }

      // Verify license exists
      const { data: companyData, error: licenseError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('license_number', licenseNumber)
        .single();

      if (licenseError || !companyData) {
        toast({
          variant: "destructive",
          title: "Invalid License",
          description: "Please check your company license number.",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/company-hub`
        }
      });

      if (error) throw error;

      // Store license in session storage
      sessionStorage.setItem("companyLicense", licenseNumber);

      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      console.error("Auth error:", error);
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your company license and email to receive a magic link
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="text"
          required
          placeholder="Company License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="mb-4"
        />
        <Input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Magic Link...
            </>
          ) : (
            "Send Magic Link"
          )}
        </Button>
        <div className="text-center mt-4">
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground"
          >
            Need a license? Click here to get started
          </Button>
        </div>
      </form>
    </div>
  );
};