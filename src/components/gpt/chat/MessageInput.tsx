import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInput = ({ 
  inputValue, 
  setInputValue, 
  isLoading, 
  onSubmit 
}: MessageInputProps) => {
  return (
    <Card className="fixed bottom-0 left-64 right-64 mx-auto bg-white border-t shadow-lg">
      <form onSubmit={onSubmit} className="p-4">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] resize-none text-sm text-gray-900 bg-white border-gray-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </Card>
  );
};