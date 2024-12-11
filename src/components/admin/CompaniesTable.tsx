import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type Company = Database["public"]["Tables"]["companies"]["Row"] & {
  details?: Database["public"]["Tables"]["company_details"]["Row"];
};

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
            <TableHead>Status</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Loading companies...
              </TableCell>
            </TableRow>
          ) : companies?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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
                  {company.details?.registration_status || 'active'}
                </TableCell>
                <TableCell>
                  {company.details?.contact_email ? (
                    <div className="text-sm">
                      <div>{company.details.contact_email}</div>
                      <div className="text-muted-foreground">
                        {company.details.contact_first_name} {company.details.contact_last_name}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No contact info</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};