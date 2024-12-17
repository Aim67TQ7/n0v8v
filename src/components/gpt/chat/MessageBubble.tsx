import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  // Don't render system messages
  if (role === "system") return null;

  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-md p-2 text-xs", // Reduced padding and font size
          role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};