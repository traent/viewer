import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CrossProjectReferenceV0 } from '@ledger-objects';
import { isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { CrossProjectReferenceSnapshot, LogItemImage, Project } from '@viewer/models';
import { LedgerAccessorService, ProjectParticipantService, ProjectService } from '@viewer/services';
import { getProjectParticipantId, parseUid, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-cross-project-reference-log-item',
  templateUrl: './cross-project-reference-log-item.component.html',
})
export class CrossProjectReferenceLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };

  private readonly snapshot$ = new BehaviorSubject<CrossProjectReferenceSnapshot | null>(null);
  @Input() set snapshot(value: CrossProjectReferenceSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'agreements' },
    bgColor: 'tw-bg-neutral-100',
    textColor: 'tw-text-neutral-500',
  };

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
      const obj = snapshotContent<CrossProjectReferenceV0>(snapshot);
      let targetProject: Project | undefined;
      let targetLedgerId: string | undefined;

      if (isExportedAndDefined(obj.targetId)) {
        targetProject = await this.projectService.findProjectByUid(obj.targetId);
        targetLedgerId = parseUid(obj.targetId).ledgerId;
      }

      const targetProjectName = redactedValue(targetProject?.name);
      const targetProjectClass = redactedClass(targetProject, 'pointer tw-underline');

      return {
        member,
        targetLedgerId,
        operation: snapshot.operation,
        targetProjectName,
        targetProjectClass,
      };
    }),
  );

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
  ) { }

  clickHandler(pointerClasses: string, ledgerId?: string) {
    if (!ledgerId) {
      return;
    }

    if (pointerClasses.includes('project')) {
      this.ledgerAccessorService.selectLedger(ledgerId);
      this.router.navigate(['/ui-refresh']);
    }
  }
}

