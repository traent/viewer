/* tslint:disable */
/* eslint-disable */
import { Transition as WorkflowsDsLv0Transition } from '../WorkflowsDSLv0/transition';
export interface State {
  constraints: Array<string>;
  description: string;
  id: string;
  name: string;
  transitions: Array<WorkflowsDsLv0Transition>;
}
