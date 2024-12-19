import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute in milliseconds

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/company-hub");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    const now = Date.now();
    if (lastAttempt && (now - lastAttempt) < RATE_LIMIT_DURATION) {
      const remainingTime = Math.ceil((RATE_LIMIT_DURATION - (now - lastAttempt)) / 1000);
      toast({
        variant: "destructive",
        title: "Please wait",
        description: `Please wait ${remainingTime} seconds before requesting another magic link.`
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/company-hub`,
          data: {
            email_confirmed: true
          }
        }
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          toast({
            variant: "destructive",
            title: "Too many attempts",
            description: "Please wait a minute before trying again."
          });
        } else {
          throw error;
        }
        return;
      }

      // Update last attempt timestamp
      setLastAttempt(Date.now());
      localStorage.setItem('lastLoginAttempt', Date.now().toString());

      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load last attempt from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastLoginAttempt');
    if (stored) {
      setLastAttempt(parseInt(stored));
    }
  }, []);

  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome Back"
        subtitle="Enter your email to receive a magic link"
      />
      
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={loading}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading || (lastAttempt && (Date.now() - lastAttempt) < RATE_LIMIT_DURATION)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Magic Link...
            </>
          ) : (
            "Send Magic Link"
          )}
        </Button>

        {lastAttempt && (Date.now() - lastAttempt) < RATE_LIMIT_DURATION && (
          <p className="text-sm text-muted-foreground text-center">
            Please wait before requesting another magic link
          </p>
        )}
      </form>
    </AuthCard>
  );
};

export default Login;