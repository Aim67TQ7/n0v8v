import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./PasswordInput";
import { supabase } from "@/integrations/supabase/client";

export const EmailSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store license in session storage
      sessionStorage.setItem("companyLicense", licenseNumber);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/");
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
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        className="w-full relative overflow-hidden"
        disabled={loading}
      >
        {loading ? (
          <>
            Signing in...
            <div className="absolute inset-0 overflow-hidden">
              <div className="loading-bar" />
            </div>
          </>
        ) : (
          "Sign In"
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
  );
};