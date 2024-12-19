import { useState } from "react";
import { EmailSignIn } from "@/components/auth/EmailSignIn";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password');

  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome Back"
        subtitle={authMode === 'password' ? 
          "Sign in with your email and password" : 
          "Get a magic link sent to your email"
        }
      />
      
      {authMode === 'password' ? (
        <div className="space-y-4">
          <EmailSignIn />
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setAuthMode('magic')}
              className="text-sm text-muted-foreground"
            >
              New user? Get a magic link instead
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SignInForm />
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setAuthMode('password')}
              className="text-sm text-muted-foreground"
            >
              Have an account? Sign in with password
            </Button>
          </div>
        </div>
      )}
    </AuthCard>
  );
};

export default Login;