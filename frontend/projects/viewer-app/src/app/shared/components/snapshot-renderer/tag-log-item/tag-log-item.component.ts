import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TagV0 } from '@ledger-objects';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { TagSnapshot } from '@viewer/models';
import { ProjectParticipantService } from '@viewer/services';
import {
  getTagImage,
  snapshotParticipantLabel,
  getTagTypeLabel,
  getChanges,
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
} from '@viewer/utils';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const getTagUpdateType = (snapshot: TagSnapshot): 'name' | 'description' | 'generic' => {
  const changes = getChanges(snapshot.delta, ['name', 'description']);
  if (changes.includes('name') && changes.length === 1) {
    return 'name';
  }
  if (changes.includes('description') && changes.length === 1) {
    return 'description';
  }
  return 'generic';
};

@Component({
  selector: 'app-tag-log-item',
  templateUrl: './tag-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };

  private readonly snapshot$ = new BehaviorSubject<TagSnapshot | null>(null);
  @Input() set snapshot(value: TagSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => {
      const obj = snapshotContent<TagV0>(snapshot);
      return getTagImage(obj.type);
    }),
  );

  private readonly projectParticipant$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot]) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId
        ? await this.projectParticipantService.getProjectParticipant({ ledgerId, id: participantId })
        : undefined;
    }),
    switchMap(snapshotParticipantLabel),
  );

  readonly props$ = combineLatest([
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    switchMap(async ([snapshot, member]) => {
      const obj = snapshotContent<TagV0>(snapshot);
      return {
        member,
        obj,
        operation: snapshot.operation,
        previousTagNameClass: redactedClass(snapshot.previous?.name),
        previousTagNameValue: redactedValue(snapshot.previous?.name),
        tagNameClass: redactedClass(obj.name),
        tagNameValue: redactedValue(obj.name),
        tagTypeLabel: getTagTypeLabel(obj.type),
        updateType: getTagUpdateType(snapshot),
      };
    }),
  );

  constructor(private readonly projectParticipantService: ProjectParticipantService) { }
}


