import { Component, Input } from '@angular/core';
import { ThreadMessage } from '@viewer/models';
import { UIPaginator } from '@traent/ngx-paginator';

@Component({
  selector: 'app-thread-messages',
  templateUrl: './thread-messages.component.html',
  styleUrls: ['./thread-messages.component.scss'],
})
export class ThreadMessagesComponent {
  @Input() paginator: UIPaginator<ThreadMessage | null> | null = null;
}
