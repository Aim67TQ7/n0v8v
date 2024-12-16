import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsForm } from "@/components/news/NewsForm";
import { NewsList } from "@/components/news/NewsList";

const CompanyNews = () => {
  const { data: news, refetch } = useQuery({
    queryKey: ["company-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Company News</h1>
        <NewsForm onNewsAdded={refetch} />
      </div>
      <NewsList news={news || []} />
    </div>
  );
};

export default CompanyNews;