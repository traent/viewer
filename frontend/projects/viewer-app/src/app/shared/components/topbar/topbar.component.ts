import { ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IdentityService, LedgerService } from '@viewer/services';

import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  @Input() logoColor: 'white' | 'black' = 'black';
  @Input() whiteStroked = false;

  showUserOverlay = false;

  readonly env = environment;
  readonly userOverlayPosition: ConnectedPosition[] = [{
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  }];

  constructor(
    readonly identityService: IdentityService,
    readonly ledgerService: LedgerService,
  ) { }
}
