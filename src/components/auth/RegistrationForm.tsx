import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) throw new Error("No user found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Registration complete",
        description: "Your account has been set up successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide some additional information
        </p>
      </div>

      <Input
        required
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />

      <Input
        required
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />

      <Input
        required
        placeholder="Company Name"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
      />

      <Input
        required
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Completing Registration..." : "Complete Registration"}
      </Button>
    </form>
  );
};