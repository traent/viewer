import { Component, Input } from '@angular/core';

interface CarouselItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {

  animation: ReturnType<typeof setTimeout> = setTimeout(() => this.goToStep(1), 0);

  @Input() step = 0;

  readonly carouselItems: CarouselItem[] = [
    {
      title: `i18n.Home.carousel.step1.title`,
      description: `i18n.Home.carousel.step1.description`,
    },
    {
      title: `i18n.Home.carousel.step2.title`,
      description: `i18n.Home.carousel.step2.description`,
    },
    {
      title: `i18n.Home.carousel.step3.title`,
      description: `i18n.Home.carousel.step3.description`,
    },
  ];

  goToStep(index: number): void {
    clearTimeout(this.animation);
    this.step = index;
    this.animation = setTimeout(() => this.goToStep(this.step % 3 + 1), 8000);
  }
}
