import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const isBypassEnabled = localStorage.getItem('bypass_auth') === 'true';

  useEffect(() => {
    // If bypass is enabled, set up demo company and redirect
    const setupDemoAccess = async () => {
      if (isBypassEnabled) {
        try {
          // Get or create DEMO company
          const { data: demoCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('name', 'DEMO')
            .eq('license_type', 'demo')
            .single();

          if (demoCompany) {
            // Store the demo company ID in localStorage for components to use
            localStorage.setItem('demo_company_id', demoCompany.id);
            console.log('Demo company access configured:', demoCompany.id);
          }
        } catch (error) {
          console.error('Error setting up demo access:', error);
        }
        navigate('/');
      }
    };

    setupDemoAccess();
  }, [isBypassEnabled, navigate]);

  const handleBypass = () => {
    localStorage.setItem('bypass_auth', 'true');
    navigate('/');
  };

  const handleNormalAccess = () => {
    localStorage.removeItem('bypass_auth');
    localStorage.removeItem('demo_company_id');
    navigate('/');
  };

  if (isBypassEnabled) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/6f945d9a-4933-4ebc-8085-8c50d698d293.png" 
            alt="Temporary Access" 
            className="mx-auto h-32 w-auto"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Choose Access Mode
          </h2>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={handleBypass}
            className="w-full bg-yellow-500 hover:bg-yellow-600"
          >
            Enter Maintenance Mode
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button
            onClick={handleNormalAccess}
            variant="outline"
            className="w-full"
          >
            Normal Access
          </Button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Maintenance mode bypasses authentication for development purposes
        </p>
      </Card>
    </div>
  );
};

export default Login;