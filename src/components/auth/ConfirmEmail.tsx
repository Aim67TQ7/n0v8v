import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== confirmEmail) {
      toast({
        variant: "destructive",
        title: "Emails don't match",
        description: "Please make sure both email addresses match.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ email: email });

      if (error) throw error;

      toast({
        title: "Confirmation email sent",
        description: "Please check your email to confirm the change.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Email update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Update your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter and confirm your new email address
          </p>
        </div>
        <form onSubmit={handleEmailConfirmation} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              required
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <Input
              type="email"
              required
              placeholder="Confirm new email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Email"}
          </Button>
        </form>
      </Card>
    </div>
  );
};