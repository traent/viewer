/* tslint:disable */
/* eslint-disable */
import { WorkflowFormat } from './workflow-format';
export interface WorkflowV0 {
  creatorId: string;
  definition?: string;
  format: WorkflowFormat;
  isActive: boolean;
  projectId: string;
  state?: string;
  updaterId: string;
}
