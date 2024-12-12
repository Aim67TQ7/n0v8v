import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

export const OTPVerification = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Verify the OTP against our email_verifications table
      const { data: verification, error: verificationError } = await supabase
        .from('email_verifications')
        .select()
        .eq('email', email)
        .eq('token', otp)
        .is('verified_at', null)
        .single();

      if (verificationError || !verification) {
        throw new Error("Invalid or expired verification code");
      }

      // Mark the verification as used
      const { error: updateError } = await supabase
        .from('email_verifications')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', verification.id);

      if (updateError) throw updateError;

      // Create the user account
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).substring(2, 15),
        options: {
          data: {
            email_verified: true
          }
        }
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Email verified successfully",
        description: "Please complete your registration.",
      });
      
      navigate("/register");
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

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code sent to {email}
        </p>
      </div>
      
      <div className="flex justify-center">
        <InputOTP
          value={otp}
          onChange={(value) => setOtp(value)}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} index={index} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      <Button
        onClick={handleVerify}
        className="w-full"
        disabled={otp.length !== 6 || loading}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
    </div>
  );
};