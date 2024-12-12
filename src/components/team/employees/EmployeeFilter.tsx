import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const EmployeeFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: EmployeeFilterProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search employees..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-64"
      />
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Employee Name</SelectItem>
          <SelectItem value="employee_number">Employee Number</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};