import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { Card } from "@/components/ui/card";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <ChangePasswordForm />
      </Card>
    </div>
  );
};

export default ResetPassword;