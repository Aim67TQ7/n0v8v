import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: `Please wait ${Math.ceil(cooldownTime / 60)} minutes before requesting another code.`,
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-otp`,
      });

      if (error) {
        const isRateLimit = 
          error.status === 429 || 
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('exceeded');

        if (isRateLimit) {
          const cooldownPeriod = 5 * 60; // 5 minutes in seconds
          setCooldown(true);
          setCooldownTime(cooldownPeriod);

          const timer = setInterval(() => {
            setCooldownTime((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setCooldown(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          throw new Error("Too many reset attempts. Please wait 5 minutes before trying again.");
        }
        throw error;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a verification code.",
      });
      
      navigate("/verify-otp", { state: { email } });
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification code",
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
            Enter your email and we'll send you a verification code
          </p>
          {cooldown && (
            <p className="mt-2 text-center text-sm text-red-600">
              Please wait {Math.ceil(cooldownTime / 60)} minutes and {cooldownTime % 60} seconds before requesting another code
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
            {loading ? "Sending..." : cooldown ? `Wait ${Math.ceil(cooldownTime / 60)}m ${cooldownTime % 60}s` : "Send Code"}
          </Button>
        </form>
      </Card>
    </div>
  );
};