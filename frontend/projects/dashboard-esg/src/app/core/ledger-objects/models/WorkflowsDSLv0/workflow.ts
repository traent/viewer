/* tslint:disable */
/* eslint-disable */
import { Constraint as WorkflowsDsLv0Constraint } from '../WorkflowsDSLv0/constraint';
import { State as WorkflowsDsLv0State } from '../WorkflowsDSLv0/state';
export interface Workflow {
  constraints: {
[key: string]: WorkflowsDsLv0Constraint;
};
  description: string;
  initialState: string;
  name: string;
  states: Array<WorkflowsDsLv0State>;
  version: string;
}
