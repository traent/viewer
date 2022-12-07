import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { DocumentContentUrlService } from '@viewer/services';
import { BehaviorSubject, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-view-viewer',
  templateUrl: './view-viewer.component.html',
  styleUrls: ['./view-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ViewViewerComponent {
  @Output() readonly contentLoad = new EventEmitter<void>();

  readonly documentId$ = new BehaviorSubject<string | null>(null);
  @Input() set documentId(documentId: string | null) {
    this.documentId$.next(documentId);
  }

  readonly viewUrl$ = this.documentId$.pipe(
    isNotNullOrUndefined(),
    switchMap((id) => this.documentUrlService.getDocumentContentUrl({
      id,
      subResource: 'public-view/index.html',
    })),
    map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url)),
  );

  loaded = false;

  constructor(
    private readonly documentUrlService: DocumentContentUrlService,
    private readonly sanitizer: DomSanitizer,
  ) { }

  loadHandler(event: any) {
    if (event.srcElement.src) {
      this.loaded = true;
      this.contentLoad.emit();
    }
  }
}
