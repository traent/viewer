import { Component, HostBinding, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ThreadMessage, ThreadMessageEntity, WorkflowParticipant } from '@viewer/models';
import { AcknowledgementService, ProjectParticipantService, ThreadService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import {
  MaterialOrCustomIcon,
  MessageFragment,
  MessageFragmentType,
  ThreadMessageStatus,
  isExportedAndDefined,
  isRedactedOrUndefined,
  isExported,
} from '@traent/ngx-components';
import { of, map, BehaviorSubject, switchMap, filter } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

const mapFragmentIcon: Record<string, MaterialOrCustomIcon> = {
  StreamEntry: { custom: 'stream-overview' },
  Document: { material: 'insert_drive_file' },
  Thread: { material: 'chat' },
  ProjectParticipant: { material: 'account_circle' },
};

const mapFragmentClass: Record<string, string> = {
  StreamEntry: 'stream',
  Document: 'document',
  Thread: 'thread',
  ProjectParticipant: 'participant',
};

@Component({
  selector: 'app-thread-message',
  templateUrl: './thread-message.component.html',
  styleUrls: ['./thread-message.component.scss'],
})
export class ThreadMessageComponent {
  @Input() @HostBinding('class') mode: 'complete' | 'reduced' = 'complete';

  readonly threadMessage$ = new BehaviorSubject<ThreadMessage | null>(null);
  @Input() set threadMessage(value: ThreadMessage | null) {
    this.threadMessage$.next(value);
  }

  readonly creator$ = this.threadMessage$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (threadMessage) => isExported(threadMessage.creatorId)
      ? this.projectParticipantService.getProjectParticipant(threadMessage.creatorId)
      : undefined,
    ),
  );

  readonly acksInfo$ = this.threadMessage$.pipe(
    map((threadMessage) => threadMessage?.updatedInBlock.index),
    isNotNullOrUndefined(),
    switchMap((blockIndex) => this.acknowledgementService.getAcknowledgementStatus(blockIndex)),
  );

  readonly fragments$ = this.threadMessage$.pipe(
    isNotNullOrUndefined(),
    filter((threadMessage): threadMessage is ThreadMessage & { message: string } => isExportedAndDefined(threadMessage.message)),
    switchMap(async (threadMessage) => ({
      message: threadMessage?.message,
      entities: await threadMessage?.threadMessageEntities(),
    })),
    switchMap(({ message, entities }) => this.getFragmentsFromMessage(message, entities)),
  );

  readonly replyTo$ = this.threadMessage$.pipe(
    isNotNullOrUndefined(),
    map((threadMessage) => threadMessage.replyToId),
    filter((replyToId): replyToId is string => isExportedAndDefined(replyToId)),
    switchMap((id) => this.threadService.getThreadMessage(id)),
  );

  readonly ThreadMessageStatus = ThreadMessageStatus;
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly router: Router,
    readonly threadService: ThreadService,
  ) { }

  async getFragmentsFromMessage(
    message?: string,
    entities: Array<Partial<ThreadMessageEntity> | undefined> = [],
  ): Promise<MessageFragment[]> {
    if (!message) {
      return [];
    }

    const redactedEntity = entities.find((entity) =>
      isRedactedOrUndefined(entity) || isRedactedOrUndefined(entity?.offset) || isRedactedOrUndefined(entity?.length));

    // At this point having at least one redacted entity makes impossible to reconstruct the entire fragments sequence.
    if (!entities.length || redactedEntity) {
      return [{
        kind: MessageFragmentType.Simple,
        text: message.trimEnd(),
      }];
    }

    const entitiesSorted = (entities as (ThreadMessageEntity & { offset: number; length: number })[]).sort((a, b) =>
      (a.offset || 0) - (b.offset || 0));
    let currentIndex = 0;
    const messageFragments: MessageFragment[] = [];

    for (let index = 0; index < entitiesSorted.length; index++) {
      const e = entitiesSorted[index];

      const isLastEntity = index === entitiesSorted.length - 1;

      if (e?.offset !== currentIndex) {
        const offset = e?.offset || 0;
        messageFragments.push({
          kind: MessageFragmentType.Simple,
          text: message.substring(currentIndex, offset),
        });
        currentIndex = e?.offset || 0;
      }
      if (e?.offset === currentIndex) {

        if (isExportedAndDefined(e.type)) {
          if (e.type !== 'ProjectParticipant') {
            messageFragments.push({
              additionalData: {type: e.type},
              class: mapFragmentClass[e.type],
              icon: mapFragmentIcon[e.type],
              kind: MessageFragmentType.Rich,
              label: of(message.substring(currentIndex, currentIndex + (e.length || 0))),
              value: isExportedAndDefined(e.value) ? e.value : '',
            });
          } else {
            const projectParticipant = isExportedAndDefined(e.value)
              ? await this.projectParticipantService.getProjectParticipant(e.value)
              : undefined;
            const fullName$ = projectParticipant
              ?  projectParticipant !== WorkflowParticipant
                ? projectParticipant.member$.pipe(map((member) => member?.fullName), isNotNullOrUndefined())
                : of('Workflow')
              : of('Redacted');

            messageFragments.push({
              additionalData: {type: e.type},
              class: mapFragmentClass[e.type],
              icon: mapFragmentIcon[e.type],
              kind: MessageFragmentType.Rich,
              label: fullName$,
              value: isExportedAndDefined(e.value) ? e.value : '',
            });
          }
        } else {
          // redacted type
          messageFragments.push({
            additionalData: {},
            class: 'redacted-fragment',
            icon: { material: 'help_center'},
            kind: MessageFragmentType.Rich,
            label: of(message.substring(currentIndex, currentIndex + (e.length || 0))),
            value: '',
          });
        }

        currentIndex += e.length || 0;
      }

      if (isLastEntity && currentIndex < message.length) {
        messageFragments.push({
          kind: MessageFragmentType.Simple,
          text: message.substring(currentIndex, currentIndex + (message.length || 0)),
        });
      }
    }

    return messageFragments
      .map((m, index, self) => index === self.length - 1 && m.kind === MessageFragmentType.Simple
        ? { ...m, text: m.text }
        : { ...m },
      );
  };

  async selectFragmentHandler(item: MessageFragment): Promise<void> {
    if (item.kind !== MessageFragmentType.Rich) {
      return;
    }

    let route: string[] = [];
    if (!item.additionalData?.type) {
      return;
    }

    if (item.additionalData.type === 'Document') {
      route = ['/project', 'documents'];
    } else if (item.additionalData.type === 'Thread') {
      route = ['/project', 'threads'];
    } else if (item.additionalData.type === 'StreamEntry') {
      route = ['/project', 'streams'];
    }

    if (!route.length) {
      return;
    }

    await this.router.navigate([...route, {
      outlets: {
        primary: [item.value],
        aside: [item.value],
      }},
    ]);
  }
}
