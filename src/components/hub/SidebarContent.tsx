import { ChatHistory } from "./ChatHistory";
import { TrainingMaterials } from "./TrainingMaterials";

export const SidebarContent = () => {
  return (
    <div className="h-full flex flex-col">
      <ChatHistory className="flex-grow" />
      <div className="mt-4">
        <TrainingMaterials />
      </div>
    </div>
  );
};