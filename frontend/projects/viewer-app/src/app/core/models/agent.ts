import { ViewerAgent } from '@api/models';

export type Agent = ViewerAgent & {
  fullName?: string;
  mock?: boolean;
  shortName?: string;
};
