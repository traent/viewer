import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StreamEntry } from '@viewer/models';
import { ProjectParticipantService, ThreadService, AcknowledgementService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { getStreamTypeIcon } from '@viewer/utils';
import { isExported } from '@traent/ngx-components';
import { BehaviorSubject, switchMap, filter, combineLatest, of } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

@Component({
  selector: 'app-stream-overview',
  templateUrl: './stream-overview.component.html',
  styleUrls: ['./stream-overview.component.scss'],
})
export class StreamOverviewComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  private readonly stream$ = new BehaviorSubject<StreamEntry | null>(null);
  @Input() set stream(value: StreamEntry | null) {
    this.stream$.next(value);
  }
  get stream(): StreamEntry | null {
    return this.stream$.value;
  }

  readonly streamClasses$ = this.stream$.pipe(
    isNotNullOrUndefined(),
    switchMap((stream) => this.tagService.getTagEntryCollection({
      page: 1,
      taggedResourceId: stream.id,
    })),
    switchMap(({ items }) => items.length > 0 ? combineLatest(items.map((tagEntry) => tagEntry.tag())) : of([])),
  );

  readonly blockAcknowledgementsInfo$ = this.stream$.pipe(
    filter((stream): stream is StreamEntry => stream !== null),
    switchMap((stream) => this.acknowledgementService.getAcknowledgementStatus(stream.updatedInBlock.index)),
  );

  readonly participant$ = this.stream$.pipe(
    filter((stream): stream is StreamEntry => stream !== null),
    switchMap(async (stream) => isExported(stream.updaterId)
      ? this.projectParticipantService.getProjectParticipant(stream.updaterId)
      : undefined,
    ),
  );

  @Input() referencesCount: number | null = null;

  @Output() referencesClick = new EventEmitter<void>();

  readonly getStreamTypeIcon = getStreamTypeIcon;

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
    readonly dialog: MatDialog,
    readonly threadService: ThreadService,
  ) { }
}
