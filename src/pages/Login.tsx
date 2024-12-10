import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const Login = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/company-gpt");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to Company GPT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign in to access your AI assistant
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0284c7',
                  brandAccent: '#0369a1',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/company-gpt`}
        />
      </Card>
    </div>
  );
};

export default Login;