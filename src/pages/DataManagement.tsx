import { Card } from "@/components/ui/card";
import { FileUp, Brain, BookOpen, FileSearch } from "lucide-react";
import { ResourceCard } from "@/components/gpt/ResourceCard";

const DataManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Data Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResourceCard
          icon={FileUp}
          title="RAG Upload"
          description="Upload and manage documents for Retrieval-Augmented Generation"
          href="/data/rag-upload"
        />

        <ResourceCard
          icon={Brain}
          title="GPT Instructions"
          description="Configure and manage GPT model instructions and parameters"
          href="/data/gpt-instructions"
        />

        <ResourceCard
          icon={BookOpen}
          title="User Instructions"
          description="Manage user guidelines and documentation"
          href="/data/user-instructions"
        />

        <ResourceCard
          icon={FileSearch}
          title="Document Parser"
          description="Parse and process various document formats"
          href="/data/document-parser"
        />
      </div>
    </div>
  );
};

export default DataManagement;