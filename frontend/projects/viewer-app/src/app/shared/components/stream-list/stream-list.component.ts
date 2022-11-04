import { Component, Input, EventEmitter, Output } from '@angular/core';
import { StreamEntry } from '@viewer/models';
import { UIPaginator } from '@traent/ngx-paginator';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss'],
})
export class StreamListComponent {

  @Input() paginator: UIPaginator<StreamEntry | null> | null = null;

  @Output() readonly itemClick = new EventEmitter<StreamEntry>();

}
