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
  const [timeRemaining, setTimeRemaining] = useState(0);
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

  // Load last attempt from localStorage and handle countdown
  useEffect(() => {
    const stored = localStorage.getItem('lastLoginAttempt');
    if (stored) {
      const lastAttemptTime = parseInt(stored);
      const now = Date.now();
      if (now - lastAttemptTime < RATE_LIMIT_DURATION) {
        setLastAttempt(lastAttemptTime);
      }
    }
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (!lastAttempt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastAttempt;
      
      if (elapsed >= RATE_LIMIT_DURATION) {
        setTimeRemaining(0);
        setLastAttempt(null);
        localStorage.removeItem('lastLoginAttempt');
        clearInterval(interval);
      } else {
        setTimeRemaining(Math.ceil((RATE_LIMIT_DURATION - elapsed) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastAttempt]);

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
          emailRedirectTo: `${window.location.origin}/company-hub`
        }
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          // Update last attempt timestamp
          const newLastAttempt = Date.now();
          setLastAttempt(newLastAttempt);
          localStorage.setItem('lastLoginAttempt', newLastAttempt.toString());
          
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

      // Update last attempt timestamp on successful request
      const newLastAttempt = Date.now();
      setLastAttempt(newLastAttempt);
      localStorage.setItem('lastLoginAttempt', newLastAttempt.toString());

      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const isRateLimited = lastAttempt && (Date.now() - lastAttempt) < RATE_LIMIT_DURATION;

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
          disabled={loading || isRateLimited}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading || isRateLimited}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Magic Link...
            </>
          ) : isRateLimited ? (
            `Wait ${timeRemaining}s to request again`
          ) : (
            "Send Magic Link"
          )}
        </Button>

        {isRateLimited && (
          <p className="text-sm text-muted-foreground text-center">
            Please wait before requesting another magic link
          </p>
        )}
      </form>
    </AuthCard>
  );
};

export default Login;