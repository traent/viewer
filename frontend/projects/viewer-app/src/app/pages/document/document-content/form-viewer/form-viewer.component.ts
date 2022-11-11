import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StreamService } from '@viewer/services';
import { Redactable } from '@traent/ngx-components';
import { BehaviorSubject, switchMap, combineLatest, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNotNullOrUndefined, trackById } from '@traent/ts-utils';

import { ViewDocumentFormService } from './view-document-form.service';

const getItemForm = (form: FormGroup, id: string): FormGroup => form.get(id) as FormGroup;

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss'],
})
export class FormViewerComponent {

  @Input() viewMode: 'current' | 'historic' = 'current';

  readonly data$ = new BehaviorSubject<Blob | null | undefined>(null);
  @Input() set data(value: Blob | null | undefined) {
    this.data$.next(value);
  }

  @Input() name?: Redactable<string>;

  readonly documentId$ = new BehaviorSubject<string | null>(null);
  @Input() set documentId(documentId: string | null) {
    this.documentId$.next(documentId);
  }

  @Output() readonly contentLoad = new EventEmitter<void>();

  readonly streamReferences$ = this.documentId$.pipe(
    isNotNullOrUndefined(),
    switchMap((documentId) => this.streamService.getStreamReferencesCollection({ documentId, page: 1 })),
    map((page) => page.items),
  );

  readonly viewDocumentForm$ = combineLatest([
    this.documentId$.pipe(isNotNullOrUndefined()),
    this.streamReferences$.pipe(isNotNullOrUndefined()),
    this.data$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(([documentId, streamReferences, data]) =>
      this.viewDocumentFormService.viewForm(documentId, this.viewMode, streamReferences, data),
    ),
    tap(() => this.contentLoad.next()),
  );

  readonly trackById = trackById;
  readonly getItemForm = getItemForm;

  constructor(
    private readonly streamService: StreamService,
    private readonly viewDocumentFormService: ViewDocumentFormService,
  ) { }

}
