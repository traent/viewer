import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MaterialOrCustomIcon } from '@traent/ngx-components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-news-status',
  styleUrls: ['./header-news-status.component.scss'],
  templateUrl: './header-news-status.component.html',
})
export class HeaderNewsStatusComponent {
  @Input() label?: string;
  @Input() icon?: MaterialOrCustomIcon;
}
