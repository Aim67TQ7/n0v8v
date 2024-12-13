import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

export const KnowledgeCard = () => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-2">
        <BookOpen className="h-5 w-5 text-primary shrink-0 mt-1" />
        <div className="space-y-2">
          <h3 className="font-medium">Knowledge Base</h3>
          
          <div className="text-sm text-muted-foreground space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Basic Instructions</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Be clear and specific in your questions</li>
                <li>Provide context when needed</li>
                <li>Use follow-up questions to refine responses</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-1">Training Tips</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Start with simple queries and build complexity</li>
                <li>Use examples to guide the model</li>
                <li>Break complex tasks into smaller steps</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-1">Best Practices</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Review and validate generated content</li>
                <li>Provide feedback for improvement</li>
                <li>Save useful conversations for reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};