import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BranchInput } from "./BranchInput";
import type { Branch } from "@/types/fishbone";

interface BranchNodeProps {
  branch: Branch;
  onAddBranch: (parentId: string, text: string) => void;
  level: number;
}

export const BranchNode = ({ branch, onAddBranch, level }: BranchNodeProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (text: string) => {
    onAddBranch(branch.id, text);
    setIsAdding(false);
  };

  return (
    <div className="ml-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1 p-4 border rounded-lg bg-background">
          <p className="text-sm">{branch.text}</p>
        </div>
        {level < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Branch
          </Button>
        )}
      </div>

      {isAdding && (
        <BranchInput onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
      )}

      {branch.children?.map((child) => (
        <BranchNode
          key={child.id}
          branch={child}
          onAddBranch={onAddBranch}
          level={level + 1}
        />
      ))}
    </div>
  );
};