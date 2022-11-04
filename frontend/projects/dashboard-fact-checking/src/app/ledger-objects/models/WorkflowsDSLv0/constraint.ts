/* tslint:disable */
/* eslint-disable */
import { ConstraintType as WorkflowsDsLv0ConstraintType } from '../WorkflowsDSLv0/constraint-type';
export interface Constraint {
  data: {
[key: string]: any;
};
  description: string;
  name: string;
  type: WorkflowsDsLv0ConstraintType;
}
