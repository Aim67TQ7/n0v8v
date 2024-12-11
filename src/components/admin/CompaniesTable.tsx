import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type Company = Database["public"]["Tables"]["companies"]["Row"];

interface CompaniesTableProps {
  companies: Company[] | undefined;
  isLoading: boolean;
}

export const CompaniesTable = ({ companies, isLoading }: CompaniesTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>License Type</TableHead>
            <TableHead>Max Users</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>License Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading companies...
              </TableCell>
            </TableRow>
          ) : companies?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            companies?.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell className="capitalize">{company.license_type}</TableCell>
                <TableCell>{company.max_users}</TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{company.license_number}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};