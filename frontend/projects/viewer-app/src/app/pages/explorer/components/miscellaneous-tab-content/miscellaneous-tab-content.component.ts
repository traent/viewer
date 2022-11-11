import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { StorageService } from '@viewer/services';
import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-miscellaneous-tab-content',
  templateUrl: './miscellaneous-tab-content.component.html',
  styleUrls: ['./miscellaneous-tab-content.component.scss'],
})
export class MiscellaneousTabContentComponent {

  readonly keyPair$ = this.storageService.getKeyPair();
  readonly exportRequest$ = this.storageService.getExportRequest();

  readonly editorOptions = new JsonEditorOptions();

  constructor(
    private readonly clipboard: Clipboard,
    private readonly storageService: StorageService,
  ) {
    this.editorOptions.enableTransform = false;
    this.editorOptions.statusBar = false;
    this.editorOptions.mode = 'view';
    this.editorOptions.mainMenuBar = false;
  }

  copy(v: string): void {
    this.clipboard.copy(v);
  }
}
