import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AIPersonality } from "./types";

interface AIPersonalitiesTableProps {
  personalities: AIPersonality[];
  onEdit: (personality: AIPersonality) => void;
  onDelete: (id: string) => void;
}

export const AIPersonalitiesTable = ({
  personalities,
  onEdit,
  onDelete,
}: AIPersonalitiesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {personalities?.map((personality) => (
          <TableRow key={personality.id}>
            <TableCell>{personality.name}</TableCell>
            <TableCell>{personality.description}</TableCell>
            <TableCell>{personality.provider}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(personality)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(personality.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};