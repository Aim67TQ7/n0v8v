import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Send } from "lucide-react";

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSave?: () => void;
  onNew?: () => void;
}

export const MessageInput = ({ 
  inputValue, 
  setInputValue, 
  isLoading, 
  onSubmit,
  onSave,
  onNew
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
          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={onSave}
              variant="outline"
              className="border-blue-600 text-blue-600"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
          {onNew && (
            <Button
              type="button"
              onClick={onNew}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};