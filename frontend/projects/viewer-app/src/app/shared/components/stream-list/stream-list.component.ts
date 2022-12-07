import { Component, Input, EventEmitter, Output } from '@angular/core';
import { UIPaginator } from '@traent/ngx-paginator';
import { StreamEntry } from '@viewer/models';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss'],
})
export class StreamListComponent {

  @Input() paginator: UIPaginator<StreamEntry | null> | null = null;

  @Output() readonly itemClick = new EventEmitter<StreamEntry>();

}
