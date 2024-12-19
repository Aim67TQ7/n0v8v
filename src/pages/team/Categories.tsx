import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CategoriesList } from "@/components/team/categories/CategoriesList";
import { AddCategoryDialog } from "@/components/team/categories/AddCategoryDialog";
import { CategoryFilter } from "@/components/team/categories/CategoryFilter";

const Categories = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <AddCategoryDialog />
      </div>
      
      <Card className="p-6">
        <CategoryFilter value={filter} onChange={setFilter} />
        <CategoriesList />
      </Card>
    </div>
  );
};

export default Categories;