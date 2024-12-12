import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const CategoryFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search categories..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="description">Description</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="department">Department</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};