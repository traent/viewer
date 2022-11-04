import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IdentityValidationPipe } from './identity-validation.pipe';

@NgModule({
  declarations: [ IdentityValidationPipe ],
  imports: [ CommonModule ],
  exports: [ IdentityValidationPipe ],
})
export class IdentityValidationModule { }
