import { Component, Input } from '@angular/core';
import { AcknowledgementStatus, BlockAcknowledgementInfo } from '@viewer/models';
import { AcknowledgementService } from '@viewer/services';

@Component({
  selector: 'app-acks-status',
  templateUrl: './acks-status.component.html',
  styleUrls: ['./acks-status.component.scss'],
})
export class AcksStatusComponent {

  @Input() blockAcknowledgementInfo: BlockAcknowledgementInfo | null = null;

  readonly AcknowledgementStatus = AcknowledgementStatus;

  constructor(readonly acknowledgementService: AcknowledgementService) {}

}
