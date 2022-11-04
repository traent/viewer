import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  NgZone,
} from '@angular/core';
import { AnchorMode, getPages } from '@traent/ngx-components';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/display/api';

const zoomValues = [0.25, 0.40, 0.50, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4] as const;
export type DocumentZoomValue = typeof zoomValues[number];

@Component({
  selector: 'app-viewer-toolbar',
  templateUrl: './viewer-toolbar.component.html',
  styleUrls: ['./viewer-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerToolbarComponent {

  @Input() data: PDFDocumentProxy | null = null;
  @Input() page?: number | null;
  @Input() anchorMode?: AnchorMode = 'point';
  @Input() zoom: DocumentZoomValue = 1;
  @Input() showAnchors = false;

  @Output() readonly zoomChange = new EventEmitter<DocumentZoomValue>();
  @Output() readonly anchorModeChange = new EventEmitter<AnchorMode>();
  @Output() readonly selectPage = new EventEmitter<PDFPageProxy>();

  navigationPopupVisible = false;
  zoomValues = zoomValues;

  get pagesButtonWidth(): string {
    const digits = (this.data?.numPages || '').toString().length;

    if (digits < 3) {
      return '132px';
    }
    if (digits === 3) {
      return '144px';
    }
    return '156px';
  }

  readonly getPages = (pdf: PDFDocumentProxy): Promise<Array<PDFPageProxy>> => new Promise(
    (resolve, reject) => this.ngZone.runOutsideAngular(() => {
      getPages(pdf).then(resolve, reject);
    }),
  );

  constructor(private readonly ngZone: NgZone) { }

  selectPageHandler(page: PDFPageProxy): void {
    this.selectPage.emit(page);
  }

  changeZoomHandler(direction: 1 | -1): void {
    let index = zoomValues.indexOf(this.zoom);
    index += direction;
    index = Math.max(0, Math.min(index, zoomValues.length - 1));
    this.zoomChange.emit(zoomValues[index]);
  }

  fitPageContentHandler(): void {
    this.zoomChange.emit(1);
  }
}
