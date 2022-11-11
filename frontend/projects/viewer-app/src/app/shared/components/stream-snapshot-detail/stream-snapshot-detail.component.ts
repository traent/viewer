import { Component, Input } from '@angular/core';
import { StreamEntryV0 } from '@ledger-objects';
import { RedactableBox, StreamEntrySnapshot } from '@viewer/models';
import { ProjectParticipantService } from '@viewer/services';
import { getProjectParticipantId, snapshotContent } from '@viewer/utils';
import { AvatarPlaceholder } from '@traent/ngx-components';
import { BehaviorSubject, switchMap } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

const hasMoreChanged = (expanded: boolean, snapshot: StreamEntrySnapshot) => {
  if (!expanded && snapshot.operation === 'update') {
    return snapshot.delta?.name !== undefined || snapshot.delta?.description !== undefined;
  }

  return false;
};

const hasPropertyChanged = (snapshot: StreamEntrySnapshot, property: keyof StreamEntrySnapshot['delta']) => {
  if (snapshot.operation === 'update') {
    return snapshot.delta[property] !== undefined;
  }

  return false;
};

@Component({
  selector: 'app-stream-snapshot-detail',
  templateUrl: './stream-snapshot-detail.component.html',
  styleUrls: ['./stream-snapshot-detail.component.scss'],
})
export class StreamSnapshotDetailComponent {

  private readonly streamSnapshot$ = new BehaviorSubject<StreamEntrySnapshot | null>(null);
  @Input() set streamSnapshot(value: StreamEntrySnapshot | null) {
    this.streamSnapshot$.next(value);
    this.streamContent$.next(value ? snapshotContent<StreamEntryV0>(value) : null);
  }
  get streamSnapshot(): StreamEntrySnapshot | null {
    return this.streamSnapshot$.value;
  }

  private readonly streamContent$ = new BehaviorSubject<RedactableBox<StreamEntryV0> | null>(null);
  get streamContent(): RedactableBox<StreamEntryV0> | null {
    return this.streamContent$.value;
  }

  readonly editor$ = this.streamSnapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (snapshot) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId ? this.projectParticipantService.getProjectParticipant(participantId) : undefined;
    }),
  );

  readonly AvatarPlaceholder = AvatarPlaceholder;
  readonly hasMoreChanged = hasMoreChanged;
  readonly hasPropertyChanged = hasPropertyChanged;
  expanded = false;

  constructor(private readonly projectParticipantService: ProjectParticipantService) { }
}
