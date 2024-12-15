import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface NewsItemProps {
  title: string;
  content: string;
  createdAt: string;
}

export const NewsItem = ({ title, content, createdAt }: NewsItemProps) => {
  // Format paragraphs by splitting on double newlines
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      <p className="text-xs text-gray-400 mb-1">
        {format(new Date(createdAt), "PPp")}
      </p>
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-xs text-gray-300 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};