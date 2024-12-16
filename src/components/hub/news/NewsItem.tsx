import { format } from "date-fns";

interface NewsItemProps {
  title: string;
  content: string;
  createdAt: string;
}

export const NewsItem = ({ title, content, createdAt }: NewsItemProps) => {
  // Format paragraphs by splitting on double newlines
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-1.5 animate-in fade-in slide-in-from-right-5 duration-500">
      <h3 className="text-sm font-semibold text-blue-900">{title}</h3>
      <p className="text-xs text-blue-800/70 font-medium">
        {format(new Date(createdAt), "PPp")}
      </p>
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-xs text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};