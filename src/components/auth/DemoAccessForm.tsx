import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const DemoAccessForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (error) throw error;

      toast({
        title: "Demo Access Created",
        description: "Please check your email to confirm your account. You'll have 24 hours of full access once you sign in.",
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
    <div>
      <div className="text-center mb-6">
        <p className="mt-2 text-sm text-gray-600">
          Create a demo account for 24-hour access
        </p>
      </div>
      <form onSubmit={handleDemoAccess} className="space-y-4">
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
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Demo Access"}
        </Button>
      </form>
    </div>
  );
};