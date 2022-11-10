/* tslint:disable */
/* eslint-disable */
import { Script as WorkflowsDsLv1Script } from '../WorkflowsDSLv1/script';
import { State as WorkflowsDsLv1State } from '../WorkflowsDSLv1/state';
export interface Workflow {
  initialState: string;
  libs?: null | {
[key: string]: WorkflowsDsLv1Script;
};
  metadata?: null | any;
  name: string;
  states: {
[key: string]: WorkflowsDsLv1State;
};
  version: string;
}
