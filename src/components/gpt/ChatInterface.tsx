import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInterfaceProps {
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInterface = ({ prompt, isLoading, onPromptChange, onSubmit }: ChatInterfaceProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Type your message here..."
        className="min-h-[200px]"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};