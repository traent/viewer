import { ViewerAgentType } from '@api/models';
import { Chance } from 'chance';

import { Agent } from '../models/agent';

export const generateMember = (id: string, participantId: string): Partial<Agent> => {
  const chance = new Chance(participantId);
  const firstName = 'User';
  const lastName = id;
  const fullName = `${firstName} ${lastName}`;
  return {
    id: participantId,
    agentType: ViewerAgentType.Member,
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
