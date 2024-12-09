import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
        });
        return;
      }

      // Verify license number and get company
      const { data: company, error: licenseError } = await supabase
        .from("companies")
        .select("id, max_users")
        .eq("license_number", licenseNumber)
        .single();

      if (licenseError) {
        toast({
          variant: "destructive",
          title: "Invalid license",
          description: "Please check your company license number and try again.",
        });
        return;
      }

      // Check if company has reached max users
      const { count: currentUsers, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: true })
        .eq("company_id", company.id);

      if (countError) {
        console.error("Error checking user count:", countError);
        throw countError;
      }

      if (currentUsers >= company.max_users) {
        toast({
          variant: "destructive",
          title: "Company user limit reached",
          description: "This company has reached its maximum number of users.",
        });
        return;
      }

      // Create the user account
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_id: company.id,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: signUpError.message,
          });
        }
        return;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      navigate("/login");
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
    <div>
      <div className="text-center mb-6">
        <p className="mt-2 text-sm text-gray-600">
          Create a new account
        </p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Input
          type="password"
          required
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Input
          type="text"
          required
          placeholder="Company License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </Button>
      </form>
    </div>
  );
};