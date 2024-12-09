import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoAccessForm } from "@/components/auth/DemoAccessForm";
import { SignInForm } from "@/components/auth/SignInForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>

          <TabsContent value="demo">
            <DemoAccessForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;