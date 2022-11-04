import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AppSwitcherModule, AvatarModule, IdentityModule } from '@traent/ngx-components';

import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';
import { TopbarComponent } from './topbar.component';

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
