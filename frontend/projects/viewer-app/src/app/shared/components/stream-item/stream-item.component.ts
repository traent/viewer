import { Component, Input } from '@angular/core';
import { StreamEntry } from '@viewer/models';
import { getStreamTypeIcon } from '@viewer/utils';

@Component({
  selector: 'app-stream-item',
  templateUrl: './stream-item.component.html',
  styleUrls: ['./stream-item.component.scss'],
})
export class StreamItemComponent {
  @Input() stream: StreamEntry | null = null;

  readonly getStreamTypeIcon = getStreamTypeIcon;
}
