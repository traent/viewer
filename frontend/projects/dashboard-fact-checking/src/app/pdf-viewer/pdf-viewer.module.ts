import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { ApplyModule, RedactedModule, VisibleModule } from '@traent/ngx-components';

import { PdfPageCanvasComponent } from './pdf-page-canvas/pdf-page-canvas.component';
import { PdfTextContentComponent } from './pdf-text-content/pdf-text-content.component';
import { PdfViewerComponent } from './pdf-viewer.component';
import { ViewerToolbarComponent } from './viewer-toolbar/viewer-toolbar.component';

const COMPONENTS = [
  PdfPageCanvasComponent,
  PdfTextContentComponent,
  PdfViewerComponent,
  ViewerToolbarComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ApplyModule,
    NgClickOutsideDirective,
    CommonModule,
    FormsModule,
    RedactedModule,
    MatButtonModule,
    MatIconModule,
    VisibleModule,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class PdfViewerModule { }
