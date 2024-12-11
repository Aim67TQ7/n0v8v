import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ChatActionsProps {
  messages: any[];
  handleEmailOpen: (content: string) => void;
  handleFiveWhysRedirect: (description: string) => void;
}

export const ChatActions = ({ messages, handleEmailOpen, handleFiveWhysRedirect }: ChatActionsProps) => {
  const lastMessages = messages;
  
  const isEmailConfirmation = lastMessages.some(msg => 
    msg.role === "user" && 
    /^(yes|yeah|sure|okay|ok|proceed|open email)$/i.test(msg.content.trim())
  );
  
  const hasEmailPrompt = lastMessages.some(msg => 
    msg.role === "system" && 
    msg.content.includes("invitation emails")
  );

  if (isEmailConfirmation && hasEmailPrompt) {
    const emailContent = lastMessages
      .filter(msg => msg.role === "assistant")
      .slice(-2)[0]?.content || "";
    
    handleEmailOpen(emailContent);
  }

  const isFiveWhysConfirmation = lastMessages.some(msg => 
    msg.role === "user" && 
    /^(yes|yeah|sure|okay|ok|proceed|let's do it|start)$/i.test(msg.content.trim())
  );
  
  const hasFiveWhysPrompt = lastMessages.some(msg => 
    msg.role === "system" && 
    msg.content.includes("root cause analysis")
  );

  if (isFiveWhysConfirmation && hasFiveWhysPrompt) {
    const problemDescription = lastMessages
      .filter(msg => msg.role === "user")
      .map(msg => msg.content)
      .join(" ");
    
    handleFiveWhysRedirect(problemDescription);
  }

  return null; // This is a logic-only component
};