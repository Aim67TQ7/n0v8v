import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3 text-sm",
          role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};