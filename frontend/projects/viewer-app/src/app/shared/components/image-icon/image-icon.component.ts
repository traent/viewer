import { Component, Input } from '@angular/core';
import { LogItemImage } from '@viewer/models';

@Component({
  selector: 'app-image-icon',
  templateUrl: './image-icon.component.html',
  styleUrls: ['./image-icon.component.scss'],
})
export class ImageIconComponent {
  @Input() image: LogItemImage | null = null;
}
