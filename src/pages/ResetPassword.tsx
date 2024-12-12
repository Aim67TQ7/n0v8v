import { Card } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <ChangePasswordForm />
      </Card>
    </div>
  );
};

export default ResetPassword;