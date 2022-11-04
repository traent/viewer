/* tslint:disable */
/* eslint-disable */
import { Script as WorkflowsDsLv1Script } from '../WorkflowsDSLv1/script';
import { Transition as WorkflowsDsLv1Transition } from '../WorkflowsDSLv1/transition';
export interface State {
  constraint?: WorkflowsDsLv1Script;
  metadata?: null | any;
  name: string;
  transitions?: null | Array<WorkflowsDsLv1Transition>;
}
