/* tslint:disable */
/* eslint-disable */
import { TransitionType as WorkflowsDsLv0TransitionType } from '../WorkflowsDSLv0/transition-type';
export interface Transition {
  data: {
[key: string]: any;
};
  description: string;
  name: string;
  nextState: string;
  type: WorkflowsDsLv0TransitionType;
}
