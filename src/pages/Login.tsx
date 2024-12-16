import { SignInForm } from "@/components/auth/SignInForm";
import { AuthCard } from "@/components/auth/AuthCard";

const Login = () => {
  return (
    <AuthCard>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to n0v8v</h1>
        <p className="mt-2 text-gray-600">
          Enter your email to get started
        </p>
      </div>
      <SignInForm />
    </AuthCard>
  );
};

export default Login;