import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareButtonsComponent {
  @Input() url?: string;
}
