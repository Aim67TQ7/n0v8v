import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface EmailSignUpProps {
  onVerificationSent: (email: string) => void;
}

export const EmailSignUp = ({ onVerificationSent }: EmailSignUpProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a 6-digit code
      const verificationCode = Math.random().toString().substring(2, 8);
      
      // Store the verification code
      const { error: verificationError } = await supabase
        .from('email_verifications')
        .insert([
          { 
            email,
            token: verificationCode
          }
        ]);

      if (verificationError) throw verificationError;

      // Send verification email using Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: [email],
          subject: "Your verification code",
          html: `
            <h1>Welcome to Company GPT!</h1>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>Enter this code to complete your registration.</p>
          `
        }
      });

      if (emailError) throw emailError;

      onVerificationSent(email);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
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
    <form onSubmit={handleSignUp} className="space-y-4">
      <Input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Sending verification..." : "Create Account"}
      </Button>
    </form>
  );
};