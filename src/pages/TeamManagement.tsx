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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, ArrowUpDown, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TeamManagement = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("department");
  const [sortField, setSortField] = useState<string>("department");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          leader:profiles(id, first_name, last_name, photo_url),
          department_members(
            profile:profiles(id, first_name, last_name, photo_url)
          )
        `);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching departments",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const filteredDepartments = departments?.filter((dept) => {
    const searchValue = filter.toLowerCase();
    switch (filterBy) {
      case "department":
        return dept.name.toLowerCase().includes(searchValue);
      case "location":
        return dept.location.toLowerCase().includes(searchValue);
      case "leader":
        return (
          dept.leader?.first_name?.toLowerCase().includes(searchValue) ||
          dept.leader?.last_name?.toLowerCase().includes(searchValue)
        );
      default:
        return true;
    }
  });

  const sortedDepartments = filteredDepartments?.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "leader") {
      aValue = `${a.leader?.first_name || ""} ${a.leader?.last_name || ""}`;
      bValue = `${b.leader?.first_name || ""} ${b.leader?.last_name || ""}`;
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex gap-4">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="leader">Leader</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Work Station
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center gap-2">
                  Location
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("department")}
              >
                <div className="flex items-center gap-2">
                  Department
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("leader")}
              >
                <div className="flex items-center gap-2">
                  Leader
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Team Members</TableHead>
              <TableHead>Labor Rate ($)</TableHead>
              <TableHead>Burden Rate ($)</TableHead>
              <TableHead>Primary Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDepartments?.map((dept) => (
              <TableRow key={dept.id} className="hover:bg-gray-50">
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.location}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {dept.leader?.photo_url && (
                      <img
                        src={dept.leader.photo_url}
                        alt={`${dept.leader.first_name} ${dept.leader.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>
                      {dept.leader?.first_name} {dept.leader?.last_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {dept.department_members?.map((member) => (
                      <img
                        key={member.profile.id}
                        src={member.profile.photo_url || "/placeholder.svg"}
                        alt={`${member.profile.first_name} ${member.profile.last_name}`}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        title={`${member.profile.first_name} ${member.profile.last_name}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>${dept.labor_rate || 0}</TableCell>
                <TableCell>${dept.burden_rate || 0}</TableCell>
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