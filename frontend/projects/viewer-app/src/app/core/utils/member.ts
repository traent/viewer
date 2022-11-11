import { ViewerMember as MemberApiModel } from '@api/models';
import { Member } from '@viewer/models';
import { Chance } from 'chance';

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
