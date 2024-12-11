import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  const handleBypass = () => {
    // Store a flag in localStorage to indicate bypassed auth
    localStorage.setItem('bypass_auth', 'true');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Temporary Access Mode
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Authentication is temporarily bypassed for maintenance
          </p>
        </div>
        
        <Button
          onClick={handleBypass}
          className="w-full"
        >
          Access Site
        </Button>
      </Card>
    </div>
  );
};

export default Login;