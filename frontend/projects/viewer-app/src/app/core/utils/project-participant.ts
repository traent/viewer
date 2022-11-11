import { ProjectParticipantRole } from '@ledger-objects';
import { Redactable } from '@traent/ngx-components';

export const roleToLabel = (role?: Redactable<ProjectParticipantRole>) => {
  switch (role) {
    case ProjectParticipantRole.Admin: return 'Administrator';
    case ProjectParticipantRole.Commenter: return 'Commenter';
    case ProjectParticipantRole.Editor: return 'Editor';
    case ProjectParticipantRole.Viewer: return 'Viewer';
    default: return undefined;
  }
};
