import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentV0 } from '@ledger-objects';
import { DocumentZoomValue, isRedacted, Redactable } from '@traent/ngx-components';
import { clamp, formatBytesSize, isNotNullOrUndefined } from '@traent/ts-utils';
import { Document, DocumentContentType, DocumentSnapshot } from '@viewer/models';
import {
  AcknowledgementService,
  DocumentService,
  DOCUMENT_LABEL,
  LedgerAccessorService,
  parseDocument,
  ProjectParticipantService,
  SnapshotService,
} from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { downloadDocument, getDocumentProxy, getPlaceholderPath, snapshotContent, u8ToBlob } from '@viewer/utils';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';

const toNum = (v: string | null): number | undefined => v ? +v : undefined;

const getToggleClass = (targetVersion: number, vMain: number, vCompare: number): string => {
  if (targetVersion < vMain && targetVersion > vCompare) {
    return 'between';
  }
  if (targetVersion === vMain) {
    return 'mainDoc';
  }
  if (targetVersion === vCompare) {
    return 'compareDoc';
  }
  return 'beyond';
};

const documentDownloadTooltip = (document: Document): string => !isRedacted(document.length)
  ? `Download version (${formatBytesSize(document.length)})`
  : '';

const versionChipLabel = (version?: Redactable<number>): string | number => !!version && !isRedacted(version)
  ? version <= 99
    ? version
    : '99+'
  : '?';

@Component({
  selector: 'app-document-versions',
  templateUrl: './document-versions.component.html',
  styleUrls: ['./document-versions.component.scss'],
})
export class DocumentVersionsComponent {
  readonly vMain$ = new BehaviorSubject<number | undefined>(toNum(this.route.snapshot.queryParams.vMain));
  get vMain(): number | undefined {
    return this.vMain$.value;
  }
  set vMain(value: number | undefined) {
    this.vMain$.next(value);
  }

  readonly vCompare$ = new BehaviorSubject<number | undefined>(toNum(this.route.snapshot.queryParams.vCompare));
  get vCompare(): number | undefined {
    return this.vCompare$.value;
  }
  set vCompare(value: number | undefined) {
    this.vCompare$.next(value);
  }

  readonly source$ = this.route.params.pipe(
    switchMap(({ id }) => this.documentService.getDocument({ id })),
  );

  readonly versions$ = this.route.params.pipe(
    map((params) => params.id),
    switchMap((id) => this.snapshotService.getSnapshotCollection({ id, page: 1 })),
    map(({ items }) => {
      const ledger = this.ledgerAccessorService.getLedger();
      return items
        .filter((item): item is DocumentSnapshot => item.type === DOCUMENT_LABEL)
        .filter((item) => item.operation !== 'deletion')
        .map((snapshot) => snapshotContent<DocumentV0>(snapshot))
        .map(parseDocument)
        .map((document) => ({
          ...document,
          ackStatus$: ledger.getAcknowledgementStatus(document.updatedInBlock.index).then(({ status }) => status),
        }));
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly mainDoc$ = combineLatest([
    this.vMain$,
    this.versions$,
  ]).pipe(
    filter((_) => this.startDragY === undefined),
    switchMap(async ([vMain, versions]) => {
      if (!versions.length) {
        return;
      }

      const mainDoc = (!!vMain && versions.find((document) => !isRedacted(document.version) && document.version === vMain)) || versions[0];
      const newVMain = isRedacted(mainDoc.version) ? undefined : mainDoc.version;

      await this.router.navigate([], {
        queryParams: { vMain: newVMain },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });

      if (vMain !== newVMain) {
        this.vMain = newVMain;
      }
      return mainDoc;
    }),
    distinctUntilChanged((prev, curr) => prev?.id !== curr?.id),
  );

  readonly mainDocContent$ = this.mainDoc$.pipe(
    isNotNullOrUndefined(),
    switchMap((document) => this.documentService.getDocumentContent({ document })),
  );

  readonly mainDocProxy$ = combineLatest([
    this.mainDoc$.pipe(isNotNullOrUndefined()),
    this.mainDocContent$,
  ]).pipe(
    filter(([document, _]) => document.uiType === DocumentContentType.PDF),
    switchMap(async ([_, content]) => content && getDocumentProxy(content)),
  );


  readonly mainDocUpdater$ = this.mainDoc$.pipe(
    isNotNullOrUndefined(),
    switchMap(async ({ updaterId }) => !isRedacted(updaterId)
      ? this.projectParticipantService.getProjectParticipant({ id: updaterId })
      : undefined,
    ),
  );

  readonly compareDoc$ = combineLatest([
    this.vCompare$,
    this.versions$,
  ]).pipe(
    filter((_) => this.startDragY === undefined),
    tap(([vCompare]) => this.router.navigate([], {
      queryParams: {
        vCompare,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })),
    distinctUntilChanged(([prevInt], [nextInt]) => prevInt === nextInt),
    map(([vCompare, versions]) => {
      if (!versions.length) {
        return;
      }

      return vCompare ?
        versions.find((document) => document.version === vCompare)
        : undefined;
    }),
  );

  readonly compareDocContent$ = this.compareDoc$.pipe(
    isNotNullOrUndefined(),
    switchMap((document) => this.documentService.getDocumentContent({ document })),
  );

  readonly compareDocProxy$ = combineLatest([
    this.compareDoc$.pipe(isNotNullOrUndefined()),
    this.compareDocContent$,
  ]).pipe(
    filter(([document, _]) => document.uiType === DocumentContentType.PDF),
    switchMap(async ([_, content]) => content && getDocumentProxy(content)),
  );


  readonly compareDocUpdater$ = this.compareDoc$.pipe(
    isNotNullOrUndefined(),
    switchMap(async ({ updaterId }) => !isRedacted(updaterId)
      ? this.projectParticipantService.getProjectParticipant({ id: updaterId })
      : undefined,
    ),
  );

  zoomCompare: DocumentZoomValue = 1;
  zoomMain: DocumentZoomValue = 1;

  startDragY?: number;
  startDragToggle?: 'mainDoc' | 'compareDoc';
  startDragValue?: number;

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  get compareMode(): boolean {
    return this.vCompare$.value !== undefined;
  }

  readonly DocumentContentType = DocumentContentType;
  readonly documentDownloadTooltip = documentDownloadTooltip;
  readonly downloadDocument = downloadDocument;
  readonly getPlaceholderPath = getPlaceholderPath;
  readonly getToggleClass = getToggleClass;
  readonly u8ToBlob = u8ToBlob;
  readonly versionChipLabel = versionChipLabel;

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snapshotService: SnapshotService,
    readonly location: Location,
  ) { }

  toggleCompareMode(snapshots: Document[]): void {
    if (!snapshots.length) {
      this.vMain = undefined;
      this.vCompare = undefined;
      return;
    }

    const lastVersionNumber = snapshots[0].version;
    const lastVersion: number = lastVersionNumber !== undefined && !isRedacted(lastVersionNumber)
      ? lastVersionNumber
      : 0;

    if (!this.vMain || this.vMain < 2) {
      this.vMain = lastVersion;
    }

    this.vCompare = this.vCompare === undefined
      ? this.vMain - 1 // vMain always > vCompare
      : undefined;
  }

  startDrag(targetVersion: number, ev: any, totalVersions: number): void {
    if (targetVersion === this.vMain) {
      this.startDragToggle = 'mainDoc';
    }
    if (targetVersion === this.vCompare) {
      this.startDragToggle = 'compareDoc';
    }
    if (!this.startDragToggle) {
      return;
    }

    this.startDragY = ev.clientY;
    this.startDragValue = this.startDragToggle === 'compareDoc'
      ? this.vCompare || totalVersions
      : this.vMain;
  }

  handleDrag(ev: MouseEvent, totalVersions: number): void {
    if (this.startDragY === undefined || this.startDragValue === undefined) {
      return;
    }

    const delta = Math.ceil((ev.clientY - this.startDragY) / 52);
    const value = clamp(this.startDragValue - delta, 1, totalVersions);

    if (
      (this.startDragToggle === 'mainDoc' && this.vCompare && value <= this.vCompare) ||
      (this.startDragToggle === 'compareDoc' && this.vMain && value >= this.vMain)
    ) {
      ev.stopPropagation();
      ev.preventDefault();
      return;
    }

    if (this.startDragToggle === 'mainDoc') {
      this.vMain = value;
    }
    if (this.startDragToggle === 'compareDoc') {
      this.vCompare = value;
    }
  }

  stopDrag(): void {
    if (!this.startDragY) {
      return;
    }

    this.startDragY = undefined;

    if (this.startDragToggle === 'mainDoc') {
      this.vMain = this.vMain;
    }
    if (this.startDragToggle === 'compareDoc') {
      this.vCompare = this.vCompare;
    }
  }
}
