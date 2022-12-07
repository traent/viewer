import { Component, Input, HostBinding, ContentChild, TemplateRef } from '@angular/core';

import { PickableItem } from '../picker.model';

@Component({
  selector: 'app-ngx-t3-pickable-item',
  templateUrl: './pickable-item.component.html',
  styleUrls: ['./pickable-item.component.scss'],
})
export class PickableItemComponent {

  @ContentChild('iconTemplate', { read: TemplateRef }) customIconTemplate?: TemplateRef<any>;

  _item: PickableItem | null = null;
  @Input() set item(item: PickableItem | null) {
    this._item = item;
    this.loading = !item;
  }
  get item(): PickableItem | null {
    return this._item;
  }

  @Input() @HostBinding('class.selected') selected = false;
  @HostBinding('class.loading') loading = false;

}
