import { Building2, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
  isAuthenticated: boolean;
}

export const CompanyHeader = ({ isEditing, onEditToggle, isAuthenticated }: CompanyHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">
          {isAuthenticated ? "Company Details" : "Register Your Company"}
        </h1>
      </div>
      {isAuthenticated && (
        <Button
          onClick={onEditToggle}
          variant="outline"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      )}
    </div>
  );
};