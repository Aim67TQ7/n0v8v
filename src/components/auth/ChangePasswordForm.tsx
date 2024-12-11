import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Change Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <Input
          type="password"
          required
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Input
          type="password"
          required
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="appearance-none rounded-md relative block w-full"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </form>
    </div>
  );
};