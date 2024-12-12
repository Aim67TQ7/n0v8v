import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { PasswordInput } from "./PasswordInput";
import { OTPVerification } from "./OTPVerification";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

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

      setShowOTPVerification(true);
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

  if (showOTPVerification) {
    return <OTPVerification email={email} />;
  }

  if (showPasswordReset) {
    return (
      <ResetPasswordForm
        email={email}
        setEmail={setEmail}
        loading={loading}
        onSubmit={handleSignIn}
        onBack={() => setShowPasswordReset(false)}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome to Company GPT</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account or create a new one
        </p>
      </div>

      <Tabs defaultValue="signin" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => setShowPasswordReset(true)}
            >
              Forgot password?
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};