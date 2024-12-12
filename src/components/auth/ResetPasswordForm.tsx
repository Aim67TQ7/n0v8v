import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ResetPasswordForm = ({
  email,
  setEmail,
  loading,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="appearance-none rounded-md relative block w-full"
      />
      <div className="flex justify-between">
        <Button
          type="button"
          variant="link"
          className="text-sm"
          onClick={onBack}
        >
          Back to sign in
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};