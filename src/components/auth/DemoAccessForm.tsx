import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const DemoAccessForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: "Demo",
            last_name: "User",
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Demo Access Link Sent",
        description: "Check your email for a magic link to access the demo. You'll have 24 hours of full access once you sign in.",
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
          Enter your email to get 24-hour full access to the platform
        </p>
      </div>
      <form onSubmit={handleDemoAccess} className="space-y-6">
        <Input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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