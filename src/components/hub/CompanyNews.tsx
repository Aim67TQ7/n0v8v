import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsItem } from "./news/NewsItem";

export const CompanyNews = () => {
  const { data: news } = useQuery({
    queryKey: ["company-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_news")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-1 bg-card text-card-foreground">
      <ScrollArea className="h-[100px]">
        <div className="divide-y divide-gray-800">
          {news?.map((item) => (
            <div key={item.id} className="px-2 py-1.5">
              <NewsItem
                title={item.title}
                content={item.content}
                createdAt={item.created_at}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};