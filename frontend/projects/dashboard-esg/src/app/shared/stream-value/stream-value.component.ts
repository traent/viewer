import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RedactedType } from '@traent/ngx-components';

import { StreamEntry } from '../../core/streams';
import { formatNumber } from '../../shared/format-utils';

@Component({
  selector: 'app-stream-value',
  templateUrl: './stream-value.component.html',
  styleUrls: ['./stream-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamValueComponent {

  @Input() value: StreamEntry
    | RedactedType
    | undefined
    | null;

  @Input() rendering: 'default' | 'currency' | 'more' = 'default';

  readonly formatNumber = formatNumber;

}
