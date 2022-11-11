import { Component } from '@angular/core';
import { StorageService } from '@viewer/services';
import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-proofs-tab-content',
  templateUrl: './proofs-tab-content.component.html',
  styleUrls: ['./proofs-tab-content.component.scss'],
})
export class ProofsTabContentComponent {

  readonly editorOptions = new JsonEditorOptions();
  readonly notaryItems = this.storageService.getNotaryProofs();

  constructor(private readonly storageService: StorageService) {
    this.editorOptions.enableTransform = false;
    this.editorOptions.statusBar = false;
    this.editorOptions.mode = 'view';
    this.editorOptions.mainMenuBar = false;
  }
}
