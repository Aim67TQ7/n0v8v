import { companyModules } from "./modules/companyModules";
import { operationsModules } from "./modules/operationsModules";
import { marketingModules } from "./modules/marketingModules";
import type { ModuleCardProps } from "./ModuleCard";

export const modulesList: ModuleCardProps[] = [
  ...companyModules,
  ...operationsModules,
  ...marketingModules
];