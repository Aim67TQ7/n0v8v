import { Card } from "@/components/ui/card";
import { File } from "lucide-react";

interface TrainingMaterial {
  id: string;
  title: string;
  content: string;
  category?: string;
  attachment_url?: string;
}

export const TrainingMaterialsList = ({ materials }: { materials: TrainingMaterial[] }) => {
  return (
    <div className="space-y-2">
      {materials.map((material) => (
        <Card key={material.id} className="p-3">
          <h3 className="font-medium">{material.title}</h3>
          <p className="text-sm text-gray-500">{material.category}</p>
          <p className="text-sm mt-2">{material.content}</p>
          {material.attachment_url && (
            <a 
              href={material.attachment_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <File className="w-4 h-4 mr-1" />
              View Attachment
            </a>
          )}
        </Card>
      ))}
    </div>
  );
};