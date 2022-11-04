import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { IndicatorModel } from '../../../app.model';

@Component({
  selector: 'app-indicator-card-info-bottom-sheet',
  templateUrl: './indicator-card-info-bottom-sheet.component.html',
  styleUrls: ['./indicator-card-info-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorCardInfoBottomSheetComponent {
  constructor(
    private readonly bottomSheet: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: {
      indicatorModel: IndicatorModel;
      company?: string;
      industry?: string;
    },
  ) { }

  async close() {
    await this.bottomSheet.dismiss();
  }
}
