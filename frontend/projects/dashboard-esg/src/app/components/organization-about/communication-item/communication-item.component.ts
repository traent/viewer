import { Component, Input } from '@angular/core';
import { RedactedType } from '@traent/ngx-components';

import { Document } from '../../../core/documents';

@Component({
  selector: 'app-communication-item',
  templateUrl: './communication-item.component.html',
  styleUrls: ['./communication-item.component.scss'],
})
export class CommunicationItemComponent {

  @Input() document: Document
    | RedactedType
    | undefined
    | null;

}
