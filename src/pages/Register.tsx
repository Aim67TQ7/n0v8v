import { Card } from "@/components/ui/card";
import { RegistrationForm } from "@/components/auth/RegistrationForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <RegistrationForm />
      </Card>
    </div>
  );
};

export default Register;