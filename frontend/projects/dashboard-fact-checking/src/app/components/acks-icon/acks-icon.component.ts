import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AcknowledgementStatus } from '../../acknowledgments';

@Component({
  selector: 'app-acks-icon',
  templateUrl: './acks-icon.component.html',
  styleUrls: ['./acks-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcksIconComponent {

  @Input() status: AcknowledgementStatus | null = null;

  readonly AcknowledgementStatus = AcknowledgementStatus;
}
