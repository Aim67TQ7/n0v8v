import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Folder } from "lucide-react";
import { AuthWrapper } from "@/components/AuthWrapper";
import { CategoryFilter } from "@/components/team/categories/CategoryFilter";
import { AddCategoryDialog } from "@/components/team/categories/AddCategoryDialog";

const Categories = () => {
  const session = useSession();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          company:companies(name),
          location:locations(facility_name),
          department:departments(name),
          manager:employees(
            profile:profiles(first_name, last_name)
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const filteredCategories = categories?.filter((category) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();

    switch (filterBy) {
      case "name":
        return category.name.toLowerCase().includes(searchTerm);
      case "description":
        return category.description?.toLowerCase().includes(searchTerm);
      case "location":
        return category.location?.facility_name.toLowerCase().includes(searchTerm);
      case "department":
        return category.department?.name.toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Folder className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Categories</h1>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <CategoryFilter
              filter={filter}
              filterBy={filterBy}
              onFilterChange={setFilter}
              onFilterByChange={setFilterBy}
            />
            <AddCategoryDialog />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories?.map((category) => (
                <div key={category.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  )}
                  <div className="mt-4 text-sm text-gray-500">
                    {category.location?.facility_name && (
                      <p>Location: {category.location.facility_name}</p>
                    )}
                    {category.department?.name && (
                      <p>Department: {category.department.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Categories;