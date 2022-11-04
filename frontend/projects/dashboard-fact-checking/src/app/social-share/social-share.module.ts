import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SocialShareDirective } from './social-share.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SocialShareDirective,
  ],
  exports: [
    SocialShareDirective,
  ],
})
export class SocialShareModule { }
