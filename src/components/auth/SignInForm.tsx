import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmailSignIn } from "./EmailSignIn";
import { EmailSignUp } from "./EmailSignUp";
import { PhoneSignIn } from "./PhoneSignIn";
import { OTPVerification } from "./OTPVerification";
import { PhoneVerification } from "./PhoneVerification";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const SignInForm = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (showPhoneVerification) {
    return <PhoneVerification phone={phone} />;
  }

  if (showOTPVerification) {
    return <OTPVerification email={email} />;
  }

  if (showPasswordReset) {
    return (
      <ResetPasswordForm
        onBack={() => setShowPasswordReset(false)}
      />
    );
  }

  return (
    <Tabs defaultValue="signin" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="signin">Email Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
        <TabsTrigger value="phone">Phone Sign In</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <div className="space-y-4">
          <EmailSignIn />
          <Button
            type="button"
            variant="link"
            className="text-sm"
            onClick={() => setShowPasswordReset(true)}
          >
            Forgot password?
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="signup">
        <EmailSignUp 
          onVerificationSent={(email) => {
            setEmail(email);
            setShowOTPVerification(true);
          }}
        />
      </TabsContent>

      <TabsContent value="phone">
        <PhoneSignIn 
          onVerificationSent={(phone) => {
            setPhone(phone);
            setShowPhoneVerification(true);
          }}
        />
      </TabsContent>
    </Tabs>
  );
};