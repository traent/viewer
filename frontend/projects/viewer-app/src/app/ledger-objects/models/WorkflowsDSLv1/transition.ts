/* tslint:disable */
/* eslint-disable */
import { Script as WorkflowsDsLv1Script } from '../WorkflowsDSLv1/script';
export interface Transition {
  afterTransition?: WorkflowsDsLv1Script;
  beforeTransition?: WorkflowsDsLv1Script;
  metadata?: null | any;
  name: string;
  nextState: string;
  trigger: WorkflowsDsLv1Script;
}
