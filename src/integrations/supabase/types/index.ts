import { AuthTypes } from './auth';
import { ProfileTypes } from './profiles';
import { CompanyTypes } from './companies';
import { DepartmentTypes } from './departments';
import { EmployeeTypes } from './employees';
import { WorkcenterTypes } from './workcenters';
import { EvaluationTypes } from './evaluations';
import { ProcessTypes } from './process';
import { TrainingTypes } from './training';
import { ChatTypes } from './chat';

export type Database = AuthTypes & 
  ProfileTypes & 
  CompanyTypes & 
  DepartmentTypes & 
  EmployeeTypes & 
  WorkcenterTypes & 
  EvaluationTypes & 
  ProcessTypes & 
  TrainingTypes & 
  ChatTypes;

export * from './auth';
export * from './profiles';
export * from './companies';
export * from './departments';
export * from './employees';
export * from './workcenters';
export * from './evaluations';
export * from './process';
export * from './training';
export * from './chat';