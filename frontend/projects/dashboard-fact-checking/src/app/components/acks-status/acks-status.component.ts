import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BlockAcknowledgementInfo } from '../../acknowledgments';

@Component({
  selector: 'app-acks-status',
  templateUrl: './acks-status.component.html',
  styleUrls: ['./acks-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcksStatusComponent {
  @Input() blockAcknowledgementInfo: BlockAcknowledgementInfo | null = null;
}
