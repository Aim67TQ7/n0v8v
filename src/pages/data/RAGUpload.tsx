import { FileUploadCard } from "@/components/data/FileUploadCard";

const RAGUpload = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">RAG Document Upload</h1>
      <p className="text-gray-600 mb-6">
        Upload PDF documents and scanned files to enhance your AI assistant's knowledge base.
        These documents will be used exclusively for your company's context.
      </p>
      <FileUploadCard />
    </div>
  );
};

export default RAGUpload;