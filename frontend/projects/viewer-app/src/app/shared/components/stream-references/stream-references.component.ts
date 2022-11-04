import { Component, Input } from '@angular/core';
import { DocumentReferencesMap } from '@viewer/models';
import { DocumentSupplier } from '@viewer/services';

@Component({
  selector: 'app-stream-references',
  templateUrl: './stream-references.component.html',
  styleUrls: ['./stream-references.component.scss'],
})
export class StreamReferencesComponent {

  @Input() references: DocumentSupplier<DocumentReferencesMap>[] | null = null;

}
