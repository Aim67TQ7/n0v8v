import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "Please wait a few minutes before requesting another reset link.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        // Check for rate limit using the error code
        if (error.message.includes('rate limit') || 
            error.message.includes('exceeded') ||
            (typeof error === 'object' && 
             'code' in error && 
             error.code === 'over_email_send_rate_limit')) {
          setCooldown(true);
          // Reset cooldown after 5 minutes
          setTimeout(() => setCooldown(false), 5 * 60 * 1000);
          throw new Error("Too many reset attempts. Please wait 5 minutes before trying again.");
        }
        throw error;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to reset your password.",
      });
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset password email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password
          </p>
          {cooldown && (
            <p className="mt-2 text-center text-sm text-red-600">
              Please wait 5 minutes before requesting another reset link
            </p>
          )}
        </div>
        <form onSubmit={handleReset} className="mt-8 space-y-6">
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
            disabled={loading || cooldown}
          >
            {loading ? "Sending..." : cooldown ? "Please wait..." : "Send Reset Link"}
          </Button>
        </form>
      </Card>
    </div>
  );
};