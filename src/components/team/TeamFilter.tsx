import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const TeamFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: TeamFilterProps) => {
  return (
    <div className="flex gap-4">
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Work Center</SelectItem>
          <SelectItem value="department">Department</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Filter..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  );
};