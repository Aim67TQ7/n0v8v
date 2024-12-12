import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { PasswordInput } from "./PasswordInput";
import { AuthError } from "@supabase/supabase-js";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    // Handle specific error cases
    if (error.message.includes("Email not confirmed")) {
      toast({
        variant: "destructive",
        title: "Email not verified",
        description: "Please check your email for a verification link. Need a new link? Sign up again.",
      });
    } else if (error.message.includes("Invalid login credentials")) {
      toast({
        variant: "destructive",
        title: "Invalid credentials",
        description: "Please check your email and password and try again.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showPasswordReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;

        toast({
          title: "Password reset link sent!",
          description: "Check your email for a link to reset your password.",
        });
        
        setShowPasswordReset(false);
      } else {
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
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/company-gpt`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account before signing in.",
      });
      
      // Clear the form
      setEmail("");
      setPassword("");
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordReset) {
    return (
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        <ResetPasswordForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          onSubmit={handleSignIn}
          onBack={() => setShowPasswordReset(false)}
        />
      </div>
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
              className="appearance-none rounded-md relative block w-full"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setShowPasswordReset(true)}
              >
                Forgot password?
              </Button>
            </div>
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
              className="appearance-none rounded-md relative block w-full"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};