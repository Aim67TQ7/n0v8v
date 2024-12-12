import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { SignInForm } from "@/components/auth/SignInForm";
import { Card } from "@/components/ui/card";

const Login = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <SignInForm />
      </Card>
    </div>
  );
};

export default Login;