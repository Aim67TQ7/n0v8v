import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface PhoneSignInProps {
  onVerificationSent: (phone: string) => void;
}

export const PhoneSignIn = ({ onVerificationSent }: PhoneSignInProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a 6-digit code
      const verificationCode = Math.random().toString().substring(2, 8);
      
      // Store the verification code
      const { error: dbError } = await supabase
        .from('phone_verifications')
        .insert([
          { 
            phone_number: phone,
            verification_code: verificationCode
          }
        ]);

      if (dbError) throw dbError;

      // Send verification SMS using Edge Function
      const { error: smsError } = await supabase.functions.invoke('send-sms', {
        body: {
          to: phone,
          message: `Your verification code is: ${verificationCode}`
        }
      });

      if (smsError) throw smsError;

      onVerificationSent(phone);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      console.error("Phone auth error:", error);
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
    <form onSubmit={handlePhoneSignIn} className="space-y-4">
      <Input
        type="tel"
        required
        placeholder="Phone Number (e.g., +1234567890)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Sending code..." : "Sign In with Phone"}
      </Button>
    </form>
  );
};