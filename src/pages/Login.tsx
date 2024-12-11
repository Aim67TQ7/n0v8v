import { SignInForm } from "@/components/auth/SignInForm";
import { DemoAccessForm } from "@/components/auth/DemoAccessForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to Company GPT</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or try our demo
          </p>
        </div>

        <Tabs defaultValue="signin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="demo">Try Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>

          <TabsContent value="demo">
            <DemoAccessForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;