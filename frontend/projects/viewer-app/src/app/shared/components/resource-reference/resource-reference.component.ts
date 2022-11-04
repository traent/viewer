import { Component, HostBinding, Input } from '@angular/core';
import { ReferenceItem } from '@viewer/models';
import { RedactedType } from '@traent/ngx-components';

@Component({
  selector: 'app-resource-reference',
  templateUrl: './resource-reference.component.html',
  styleUrls: ['./resource-reference.component.scss'],
})
export class ResourceReferenceComponent {
  @Input() @HostBinding('class.has-top-divider') hasTopDivider = false;
  @Input() @HostBinding('class.has-bottom-divider') hasBottomDivider = true;
  @Input() name?: string | null | RedactedType = null;
  @Input() references: ReferenceItem[] | null = null;
  @Input() expandable = false;

  isExpanded = false;

  get isExpandable(): boolean {
    return !!this.references?.length && this.expandable;
  }
}
