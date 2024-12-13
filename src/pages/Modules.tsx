import { Factory } from "lucide-react";
import { ModulesList } from "@/components/operations/ModulesList";
import { CustomerFocusTools } from "@/components/operations/CustomerFocusTools";

const Modules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Factory className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Operations Management</h1>
      </div>
      
      <ModulesList />

      {window.location.pathname === '/operations/customer-focus' && (
        <CustomerFocusTools />
      )}
    </div>
  );
};

export default Modules;