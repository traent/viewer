import { Chance } from 'chance';

import { ProfileValidationState } from '../identity-viewer-api/models';
import  { ViewerMember as MemberApiModel } from '../identity-viewer-api/models';

export interface Member {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  shortName?: string;
  avatar?: string;
  mock?: boolean;
  memberValidationState?: ProfileValidationState;
  userValidationState?: ProfileValidationState;
  jobTitle?: string;
}

export const parseMember = (m: MemberApiModel): Member => ({
  ...m,
  mock: false,
  shortName: `${m.firstName} ${m.lastName[0]}.`,
  fullName: `${m.firstName} ${m.lastName}`,
  jobTitle: m.jobTitle || undefined,
});


export const generateMember = (id: string, participantId: string): Member => {
  const chance = new Chance(participantId);
  const firstName = 'User';
  const lastName = id;
  const fullName = `${firstName} ${lastName}`;
  return {
    id: participantId,
    mock: true,
    fullName,
    shortName: fullName,
    firstName,
    lastName,
    avatar: chance.avatar({
      protocol: 'https',
      fallback: 'identicon',
    }),
  };
};
