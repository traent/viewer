/* tslint:disable */
/* eslint-disable */
import { ProjectParticipantRole } from './project-participant-role';
export interface ProjectParticipantV0 {
  acceptCertificate?: string;
  creatorId: string;
  isParticipantPlaceholder: boolean;
  memberId: string;
  organizationId: string;
  projectId: string;
  role: ProjectParticipantRole;
  updaterId: string;
}
