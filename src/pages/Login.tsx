import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";

const Login = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  }, [session, navigate]);

  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome to n0v8v"
        subtitle="Sign in to your account or create a new one"
      />
      <SignInForm />
    </AuthCard>
  );
};

export default Login;