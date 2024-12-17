import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  // Don't render system messages
  if (role === "system") return null;

  return (
    <div className={cn("flex mb-2", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-md p-1.5 text-[0.7rem]", // Reduced padding and maintained small font
          role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="whitespace-pre-wrap leading-relaxed mb-1 last:mb-0">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};