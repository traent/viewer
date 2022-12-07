import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { IndicatorModel } from '../../../app.model';

@Component({
  selector: 'app-indicator-card-info-content',
  templateUrl: './indicator-card-info-content.component.html',
  styleUrls: ['./indicator-card-info-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorCardInfoContentComponent {
  @Input() indicatorModel?: IndicatorModel;
  @Input() company?: string;
  @Input() industry?: string;
}
