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
    <Card className="p-1 bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 shadow-lg">
      <ScrollArea className="h-[120px]">
        <div className="divide-y divide-gray-200">
          {news?.map((item) => (
            <div 
              key={item.id} 
              className="px-3 py-2 hover:bg-white/50 transition-colors duration-200"
            >
              <NewsItem
                title={item.title}
                content={item.content}
                createdAt={item.created_at}
              />
            </div>
          ))}
          {!news?.length && (
            <div className="px-3 py-2 text-gray-500 text-sm italic">
              No company news available
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};