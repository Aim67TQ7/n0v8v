import { Factory } from "lucide-react";
import { ModulesList } from "@/components/operations/ModulesList";
import { CustomerFocusTools } from "@/components/operations/CustomerFocusTools";
import { useLocation } from "react-router-dom";

const Modules = () => {
  const location = useLocation();
  const isCustomerFocus = location.pathname === '/operations/customer-focus';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Factory className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">
          {isCustomerFocus ? 'Customer Focus' : 'Modules'}
        </h1>
      </div>
      
      {isCustomerFocus ? (
        <CustomerFocusTools />
      ) : (
        <ModulesList />
      )}
    </div>
  );
};

export default Modules;