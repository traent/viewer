import { Component, Input } from '@angular/core';
import { AcknowledgementStatus } from '@viewer/models';
import { AcknowledgementService } from '@viewer/services';

@Component({
  selector: 'app-acks-icon',
  templateUrl: './acks-icon.component.html',
  styleUrls: ['./acks-icon.component.scss'],
})
export class AcksIconComponent {

  @Input() status: AcknowledgementStatus | null = null;

  readonly AcknowledgementStatus = AcknowledgementStatus;

  constructor(readonly acknowledgementService: AcknowledgementService) { }

}
