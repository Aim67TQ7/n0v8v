import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SignUpFormFields } from "./SignUpFormFields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  licenseNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      licenseNumber: "",
    },
  });

  const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: [email],
          subject: "Welcome to the Platform",
          html: `
            <h1>Welcome ${firstName}!</h1>
            <p>Thank you for signing up. We're excited to have you on board!</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          `
        }
      });

      if (error) {
        console.error("Error sending welcome email:", error);
      }
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  };

  const onSubmit = async (data: SignUpForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            license_number: data.licenseNumber || "Demo",
          },
        },
      });

      if (signUpError) throw signUpError;

      // Send welcome email
      await sendWelcomeEmail(data.email, data.firstName);

      toast({
        title: "Account created successfully",
        description: "Welcome to the platform! Please check your email for verification.",
      });

      navigate("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SignUpFormFields form={form} isLoading={isLoading} onSubmit={onSubmit} />
    </div>
  );
};