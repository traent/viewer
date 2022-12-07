import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RedactedType, isExportedAndDefined } from '@traent/ngx-components';
import { BehaviorSubject, of, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { Document, downloadDocument } from '../../core/documents';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {

  private readonly document$ = new BehaviorSubject<Document | RedactedType | undefined | null>(undefined);

  @Input() set document(document: Document | RedactedType | undefined | null) {
    this.document$.next(document);
  }

  @Input() hideNoDataLabel = false;

  readonly thumbnail$ = this.document$.pipe(
    switchMap((document) => {
      if (document !== null && isExportedAndDefined(document)) {
        return this.appService.getThumbnailFromDocument(document);
      } else {
        return of(document as RedactedType | undefined | null);
      }
    }),
  );

  constructor(private readonly appService: AppService) { }

  async openNewTab() {
    const document = await firstValueFrom(this.document$);
    if (document && isExportedAndDefined(document)) {
      const dataUrl = await document?.getDataUrl();
      if (dataUrl) {
        window.open(dataUrl, '_blank');
      }
    }
  }

  async download() {
    const document = await firstValueFrom(this.document$);
    if (document && isExportedAndDefined(document)) {
      await downloadDocument(document);
    }
  }
}
