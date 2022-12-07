import { Component, Input } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { ThreadReference } from '@viewer/models';
import { DocumentSupplier } from '@viewer/services';

@Component({
  selector: 'app-thread-references',
  templateUrl: './thread-references.component.html',
  styleUrls: ['./thread-references.component.scss'],
})
export class ThreadReferencesComponent {
  @Input() paginator: UIPaginator<DocumentSupplier<ThreadReference> | null> | null = null;
}
