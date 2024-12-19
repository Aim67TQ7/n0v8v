import { BranchNode } from "./BranchNode";
import type { Branch } from "@/types/fishbone";

interface BranchTreeProps {
  branches: Branch[];
  onAddBranch: (parentId: string, text: string) => void;
}

export const BranchTree = ({ branches, onAddBranch }: BranchTreeProps) => {
  return (
    <div className="space-y-4">
      {branches.map((branch) => (
        <BranchNode
          key={branch.id}
          branch={branch}
          onAddBranch={onAddBranch}
          level={1}
        />
      ))}
    </div>
  );
};