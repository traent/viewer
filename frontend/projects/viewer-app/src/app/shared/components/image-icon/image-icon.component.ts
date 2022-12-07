import { Component, Input } from '@angular/core';
import { LogItemImage, isCustomIcon, isString } from '@viewer/models';

@Component({
  selector: 'app-image-icon',
  templateUrl: './image-icon.component.html',
  styleUrls: ['./image-icon.component.scss'],
})
export class ImageIconComponent {
  @Input() image: LogItemImage | null = null;

  readonly isCustomIcon = isCustomIcon;
  readonly isString = isString;
}
