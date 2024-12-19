import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DepartmentsList } from "@/components/team/departments/DepartmentsList";
import { AddDepartmentDialog } from "@/components/team/departments/AddDepartmentDialog";
import { DepartmentFilter } from "@/components/team/departments/DepartmentFilter";

const Departments = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <AddDepartmentDialog />
      </div>
      
      <Card className="p-6">
        <DepartmentFilter value={filter} onChange={setFilter} />
        <DepartmentsList />
      </Card>
    </div>
  );
};

export default Departments;