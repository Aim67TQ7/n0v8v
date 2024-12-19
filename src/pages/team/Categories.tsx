import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CategoriesList } from "@/components/team/categories/CategoriesList";
import { AddCategoryDialog } from "@/components/team/categories/AddCategoryDialog";
import { CategoryFilter } from "@/components/team/categories/CategoryFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          company:companies(name),
          location:locations(facility_name),
          department:departments(name)
        `);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <AddCategoryDialog />
      </div>
      
      <Card className="p-6">
        <CategoryFilter 
          filter={filter}
          filterBy={filterBy}
          onFilterChange={setFilter}
          onFilterByChange={setFilterBy}
        />
        <CategoriesList categories={categories} />
      </Card>
    </div>
  );
};

export default Categories;