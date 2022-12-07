import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Redactable } from '@traent/ngx-components';

import { IndicatorModel } from '../../../app.model';
import { IndicatorCardInfoBottomSheetComponent } from '../indicator-card-info-bottom-sheet/indicator-card-info-bottom-sheet.component';

@Component({
  selector: 'app-indicator-card',
  templateUrl: './indicator-card.component.html',
  styleUrls: ['./indicator-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorCardComponent {
  @Input() indicatorModel?: IndicatorModel = undefined;
  @Input() company?: Redactable<string> | undefined;
  @Input() industry?: Redactable<string> | undefined;

  constructor(private readonly bottomSheet: MatBottomSheet) { }

  async openOverlay() {
    if (this.isDataPending || !this.indicatorModel?.hasDialog) {
      return;
    }
    const overlayOpt = {
      data: {
        indicatorModel: this.indicatorModel,
        company: this.company,
        industry: this.industry,
      },
    };
    await this.bottomSheet.open(IndicatorCardInfoBottomSheetComponent, overlayOpt);
  }

  get isDataPending(): boolean {
    return this.indicatorModel?.value === null || this.indicatorModel?.average === null;
  }

}
