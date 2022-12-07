import { ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdentityService, LedgerService, UiConfigurationService } from '@viewer/services';

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
  readonly showHeader = this.uiConfigurationService.header;
  readonly userOverlayPosition: ConnectedPosition[] = [{
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  }];

  constructor(
    readonly identityService: IdentityService,
    readonly ledgerService: LedgerService,
    readonly route: ActivatedRoute,
    private readonly uiConfigurationService: UiConfigurationService,
  ) { }
}
