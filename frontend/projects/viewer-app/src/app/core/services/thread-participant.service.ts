import { Injectable } from '@angular/core';
import { ProjectParticipant, ThreadParticipantParams, WorkflowParticipant, WorkflowParticipantID } from '@viewer/models';
import { collectionToPage } from '@viewer/utils';
import { isExported } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';

import { LedgerObjectsService } from './ledger-objects.service';
import { ProjectParticipantService, PROJECT_PARTICIPANT_LABEL } from './project-participant.service';
import { parseThread, ThreadService, THREAD_LABEL } from './thread.service';

@Injectable({ providedIn: 'root' })
export class ThreadParticipantService {
  constructor(
    private readonly ledgerObjectService: LedgerObjectsService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly threadService: ThreadService,
  ) { }

  async getThreadParticipantCollection(threadId: string, params?: ThreadParticipantParams): Promise<Page<ProjectParticipant>> {
    const currentState = await this.ledgerObjectService.getObjects(params?.blockIndex);
    const thread = parseThread(currentState[THREAD_LABEL][threadId]);

    const messagesAuthorIds = this.threadService.extractThreadMessagesFromState(currentState)
      .filter((m) => isExported(m.threadId) && m.threadId === threadId)
      .map((message) => message.authorId)
      .filter((id): id is string => isExported(id));

    const threadParticipants: ProjectParticipant[] = [];
    const participantIds = [...new Set([thread.creatorId, ...messagesAuthorIds])]
      .filter((id): id is string => isExported(id));

    for (const participantId of participantIds) {
      if (participantId === WorkflowParticipantID) {
        threadParticipants.push(WorkflowParticipant);
      } else {
        threadParticipants.push(
          this.projectParticipantService.parseProjectParticipant(currentState[PROJECT_PARTICIPANT_LABEL][participantId]),
        );
      }
    }

    /**
     * Note: Sorting has been disabled since it is not acutally used AND it causes a lot of
     * probles in terms of types.
     */
    return collectionToPage(
      threadParticipants,
      params?.page,
      params?.limit,
    );
  }
}
