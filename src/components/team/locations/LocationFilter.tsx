import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFilterProps {
  filter: string;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
}

export const LocationFilter = ({
  filter,
  filterBy,
  onFilterChange,
  onFilterByChange,
}: LocationFilterProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search locations..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-64"
      />
      <Select value={filterBy} onValueChange={onFilterByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="facility_name">Facility Name</SelectItem>
          <SelectItem value="city">City</SelectItem>
          <SelectItem value="state">State</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};