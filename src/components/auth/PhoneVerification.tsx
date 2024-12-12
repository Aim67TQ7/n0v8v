import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const PhoneVerification = ({ phone }: { phone: string }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify the code against our database
      const { data: verifications, error: verificationError } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone_number', phone)
        .eq('verification_code', verificationCode)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (verificationError || !verifications) {
        throw new Error('Invalid or expired verification code');
      }

      // Update the user's profile to mark phone as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ verified_phone: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Phone verified successfully!",
        description: "Your phone number has been verified.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
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

      toast({
        title: "Code sent",
        description: "A new verification code has been sent to your phone.",
      });
    } catch (error: any) {
      console.error("Send code error:", error);
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
        <h2 className="text-2xl font-bold">Verify Your Phone</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the verification code sent to {phone}
        </p>
      </div>

      <form onSubmit={handleVerification} className="space-y-4">
        <Input
          type="text"
          required
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Phone"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResendCode}
          disabled={loading}
        >
          Resend Code
        </Button>
      </form>
    </div>
  );
};