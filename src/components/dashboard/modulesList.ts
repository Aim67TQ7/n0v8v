import { companyModules } from "./modules/companyModules";
import { operationsModules } from "./modules/operationsModules";
import type { ModuleCardProps } from "./ModuleCard";

export const modulesList: ModuleCardProps[] = [
  ...companyModules,
  ...operationsModules
];