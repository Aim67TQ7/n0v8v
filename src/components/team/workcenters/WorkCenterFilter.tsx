import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkCenterFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const WorkCenterFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: WorkCenterFilterProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search work centers..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-64"
      />
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Work Center Name</SelectItem>
          <SelectItem value="department">Department</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};