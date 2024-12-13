import { BookOpenText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const KnowledgeCard = () => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-4 mb-4 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => navigate("/knowledge-base")}
    >
      <div className="flex items-center gap-2">
        <BookOpenText className="h-5 w-5" />
        <div>
          <h3 className="font-medium">Knowledge Base</h3>
          <p className="text-sm text-muted-foreground">Manage AI training and prompts</p>
        </div>
      </div>
    </Card>
  );
};