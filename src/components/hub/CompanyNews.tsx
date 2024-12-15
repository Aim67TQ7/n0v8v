import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        <div className="space-y-1">
          {news?.map((item) => (
            <p
              key={item.id}
              className="text-xs text-gray-300 px-2 hover:text-white rounded transition-colors"
            >
              {item.title}: {item.content}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};