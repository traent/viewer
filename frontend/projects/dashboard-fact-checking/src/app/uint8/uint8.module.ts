import { NgModule } from '@angular/core';

import { Uint8Pipe } from './uint8.pipe';

@NgModule({
  declarations: [
    Uint8Pipe,
  ],
  exports: [
    Uint8Pipe,
  ],
})
export class Uint8PipeModule { }
