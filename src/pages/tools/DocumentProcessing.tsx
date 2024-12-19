import { Card } from "@/components/ui/card";
import { FileUploadCard } from "@/components/data/FileUploadCard";
import { Database, FileText } from "lucide-react";

const DocumentProcessing = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Document Processing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <p className="text-muted-foreground mb-6">
              Upload PDF documents and text files to enhance your company's knowledge base.
              Our AI will process and analyze these documents to make them searchable and
              accessible across your organization.
            </p>
            <FileUploadCard />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5" />
              <h2 className="text-lg font-semibold">How It Works</h2>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Upload your PDF or text documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Documents are processed using advanced AI analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Content is organized and made searchable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Access processed documents through the Knowledge Base</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Supported Formats</h2>
            <ul className="space-y-2 text-sm">
              <li>• PDF Documents (.pdf)</li>
              <li>• Text Files (.txt)</li>
              <li>• Word Documents (coming soon)</li>
              <li>• Markdown Files (coming soon)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessing;