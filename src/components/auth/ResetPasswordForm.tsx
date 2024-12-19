import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResetPasswordFormProps {
  onBack: () => void;
}

export const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="appearance-none rounded-md relative block w-full"
      />
      <div className="flex justify-between">
        <Button
          type="button"
          variant="link"
          className="text-sm"
          onClick={onBack}
        >
          Back to sign in
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full relative overflow-hidden"
        disabled={loading}
      >
        {loading ? (
          <>
            Sending...
            <div className="absolute inset-0 overflow-hidden">
              <div className="loading-bar" />
            </div>
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
};