import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-carousel-block',
  templateUrl: './carousel-block.component.html',
  styleUrls: ['./carousel-block.component.scss'],
})
export class CarouselBlockComponent {
  @HostBinding('class') @Input() type: 'type-1' | 'type-2' | 'type-3' | 'static' = 'static';

  @HostBinding('class.is-current') @Input() isCurrent = false;
}
