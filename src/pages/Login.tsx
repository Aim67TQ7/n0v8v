import { DemoAccessForm } from "@/components/auth/DemoAccessForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Experience our platform with 24-hour demo access
          </p>
        </div>
        <DemoAccessForm />
      </div>
    </div>
  );
};

export default Login;