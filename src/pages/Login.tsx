import { SignInForm } from "@/components/auth/SignInForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";

const Login = () => {
  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome to n0v8v"
        subtitle="Enter your email to get started"
      />
      <SignInForm />
    </AuthCard>
  );
};

export default Login;