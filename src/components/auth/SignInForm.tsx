import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showPasswordReset) {
        // Send magic link for password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;

        toast({
          title: "Password reset link sent!",
          description: "Check your email for a link to reset your password.",
        });
      } else {
        // Regular email/password sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // Redirect to dashboard after successful login
        navigate("/");
      }
    } catch (error: any) {
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
        <p className="mt-2 text-sm text-gray-600">
          {showPasswordReset 
            ? "Enter your email to receive a password reset link" 
            : "Sign in to your existing account"}
        </p>
      </div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        {!showPasswordReset && (
          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded-md relative block w-full"
          />
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="text-sm"
            onClick={() => setShowPasswordReset(!showPasswordReset)}
          >
            {showPasswordReset ? "Back to sign in" : "Forgot password?"}
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading 
            ? "Processing..." 
            : showPasswordReset 
              ? "Send Reset Link"
              : "Sign In"}
        </Button>
      </form>
    </div>
  );
};