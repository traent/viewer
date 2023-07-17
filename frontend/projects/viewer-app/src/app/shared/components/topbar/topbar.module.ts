import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AppSwitcherModule, AvatarModule, IdentityModule } from '@traent/ngx-components';

import { TopbarComponent } from './topbar.component';
import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';

@NgModule({
  declarations: [
    TopbarComponent,
  ],
  imports: [
    CommonModule,
    AppSwitcherModule,
    AvatarModule,
    IdentityModule,
    IdentityValidationModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    OverlayModule,
    TranslateModule,
  ],
  exports: [
    TopbarComponent,
  ],
})
export class TopbarModule { }
