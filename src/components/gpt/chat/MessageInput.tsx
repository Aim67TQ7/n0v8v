import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onNew?: () => void;
}

export const MessageInput = ({ 
  input, 
  setInput, 
  isLoading, 
  onSubmit,
  onNew 
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 p-4 border-t">
      {onNew && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onNew}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[44px] max-h-[200px]"
      />
      <Button type="submit" size="icon" disabled={isLoading} className="shrink-0">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};