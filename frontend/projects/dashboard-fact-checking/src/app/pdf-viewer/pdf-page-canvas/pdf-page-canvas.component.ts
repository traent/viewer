import { Component, ElementRef, HostBinding, HostListener, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RenderingCancelledException } from 'pdfjs-dist';
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { debounceTime, Subject } from 'rxjs';
import { unreachable } from '@traent/ts-utils';

type PDFRenderTask = ReturnType<PDFPageProxy['render']>;

@Component({
  selector: 'app-pdf-page-canvas',
  templateUrl: './pdf-page-canvas.component.html',
  styleUrls: ['./pdf-page-canvas.component.scss'],
})
@UntilDestroy()
export class PdfPageCanvasComponent implements OnChanges, OnDestroy {
  @Input() pdfPageProxy: PDFPageProxy | null = null;
  @Input() zoom = 1;

  private task: PDFRenderTask | null = null;
  private canvas: HTMLCanvasElement | null = null;

  @HostBinding('style.width') get width(): string | undefined {
    if (!this.pdfPageProxy) {
      return undefined;
    }
    return this.zoom === 1
      ? '100%'
      : `${this.pdfPageProxy.getViewport({ scale: this.zoom }).width}px`;
  }

  @HostBinding('style.height') get height(): string | undefined {
    if (!this.pdfPageProxy) {
      return undefined;
    }
    return this.zoom === 1
      ? '100%'
      : `${this.pdfPageProxy.getViewport({ scale: this.zoom }).height}px`;
  }

  readonly resize$ = new Subject<void>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly ngZone: NgZone,
  ) {
    this.resize$.pipe(
      debounceTime(100),
      untilDestroyed(this),
    ).subscribe(() => this.ngOnChanges());
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (this.zoom === 1) {
      this.resize$.next();
    }
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.task?.cancel());
    this.canvas?.remove();
  }

  ngOnChanges(): void {
    // perform a naive form of double buffering
    // this prevents the contents from disappearing when the zoom changes

    if (!this.pdfPageProxy) {
      return;
    }

    const baseViewport = this.pdfPageProxy.getViewport({ scale: this.zoom });

    const zoom = this.zoom === 1
      ? this.elementRef.nativeElement.clientWidth / baseViewport.width
      : this.zoom;

    const viewport = this.pdfPageProxy.getViewport({ scale: zoom * window.devicePixelRatio });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const oldCanvas = this.canvas;
    this.elementRef.nativeElement.insertBefore(canvas, oldCanvas);
    this.canvas = canvas;

    const canvasContext = canvas.getContext('2d') ?? unreachable(`no canvas context`);
    const pdfPageProxy = this.pdfPageProxy;

    this.ngZone.runOutsideAngular(() => {
      this.task?.cancel();
      this.task = pdfPageProxy.render({
        canvasContext,
        viewport,
        renderInteractiveForms: true,
      });
      this.task.promise.then(() => oldCanvas?.remove(), (error) => {
        // Swallow exceptions due to cancelled tasks
        if (error instanceof RenderingCancelledException) {
          return;
        }
        throw error;
      });
    });
  }
}
