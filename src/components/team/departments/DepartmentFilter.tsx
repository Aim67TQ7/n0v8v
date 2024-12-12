import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const DepartmentFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: DepartmentFilterProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search departments..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-64"
      />
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Department Name</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="accounting_code">Accounting Code</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};