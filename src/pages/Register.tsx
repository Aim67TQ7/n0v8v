import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";

const Register = () => {
  return (
    <AuthCard>
      <AuthHeader 
        title="Create an Account"
        subtitle="Sign up to get started with n0v8v"
      />
      <RegistrationForm />
    </AuthCard>
  );
};

export default Register;