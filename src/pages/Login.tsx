import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoAccessForm } from "@/components/auth/DemoAccessForm";
import { SignInForm } from "@/components/auth/SignInForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Get Demo Access</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <DemoAccessForm />
          </TabsContent>

          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;