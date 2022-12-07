import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, AutofocusModule, FileDropModule, SafeHtmlModule } from '@traent/ngx-components';
import { NgxT3SpinnerModule } from '@traent/ngx-spinner';
import { TopbarModule } from '@viewer/shared';

import { CarouselBlockComponent } from './components/carousel/carousel-block/carousel-block.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RemoteUploaderComponent } from './components/remote-uploader/remote-uploader.component';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    CarouselBlockComponent,
    CarouselComponent,
    HomePageComponent,
    RemoteUploaderComponent,
  ],
  imports: [
    ApplyModule,
    AutofocusModule,
    CommonModule,
    FileDropModule,
    FormsModule,
    HomePageRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    NgxT3SpinnerModule,
    ReactiveFormsModule,
    SafeHtmlModule,
    TopbarModule,
    TranslateModule,
  ],
})
export class HomePageModule { }
