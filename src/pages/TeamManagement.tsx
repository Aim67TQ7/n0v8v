import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

const TeamManagement = () => {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<string>("department");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          leader:profiles(first_name, last_name),
          department_members(
            profile:profiles(id, first_name, last_name, photo_url)
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const filteredDepartments = departments?.filter((dept) =>
    Object.values(dept).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedDepartments = filteredDepartments?.sort((a, b) => {
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Work Station
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("location")}
              >
                Location
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("department")}
              >
                Department
              </TableHead>
              <TableHead>Leader</TableHead>
              <TableHead>Team Members</TableHead>
              <TableHead>Labor Rate ($)</TableHead>
              <TableHead>Burden Rate ($)</TableHead>
              <TableHead>Primary Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDepartments?.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.location}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>
                  {dept.leader?.first_name} {dept.leader?.last_name}
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {dept.department_members?.map((member) => (
                      <img
                        key={member.profile.id}
                        src={member.profile.photo_url || "/placeholder.svg"}
                        alt={`${member.profile.first_name} ${member.profile.last_name}`}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={`${member.profile.first_name} ${member.profile.last_name}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>${dept.labor_rate}</TableCell>
                <TableCell>${dept.burden_rate}</TableCell>
                <TableCell>{dept.primary_purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex gap-4">
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Work Center
        </Button>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Update Work Center
        </Button>
      </div>
    </div>
  );
};

export default TeamManagement;