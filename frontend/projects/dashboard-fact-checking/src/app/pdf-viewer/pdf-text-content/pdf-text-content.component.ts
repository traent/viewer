import { Component, Input } from '@angular/core';
import { TextContent } from 'pdfjs-dist/types/display/api';

const getFontSizeFromTransform = (transform: number[]): number => Math.hypot(transform[2], transform[3]);

@Component({
  selector: 'app-pdf-text-content',
  templateUrl: './pdf-text-content.component.html',
  styleUrls: ['./pdf-text-content.component.scss'],
})
export class PdfTextContentComponent {
  @Input() textContent: TextContent | null = null;
  @Input() pageNumber?: number;

  readonly getFontSizeFromTransform = getFontSizeFromTransform;
}
