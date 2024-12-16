import { Card } from "@/components/ui/card";
import { NewsItem } from "@/components/hub/news/NewsItem";

interface NewsListProps {
  news: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
  }>;
}

export const NewsList = ({ news }: NewsListProps) => {
  return (
    <div className="space-y-4">
      {news?.map((item) => (
        <Card key={item.id} className="p-4">
          <NewsItem
            title={item.title}
            content={item.content}
            createdAt={item.created_at}
          />
        </Card>
      ))}
      {!news?.length && (
        <div className="text-gray-500 text-sm italic">
          No company news available
        </div>
      )}
    </div>
  );
};