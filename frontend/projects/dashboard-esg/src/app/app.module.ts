import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconModule, ApplyModule, RedactedModule, SkeletonModule } from '@traent/ngx-components';
import { NgChartsModule } from 'ng2-charts';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { environment } from '../environments/environment';
import { AppService } from './app.service';
import {
  IndicatorBarChartComponent,
} from './components/organization-indicators/indicator-bar-chart/indicator-bar-chart.component';
import { IndicatorCardComponent } from './components/organization-indicators/indicator-card/indicator-card.component';
import {
  OrganizationIndicatorsComponent,
} from './components/organization-indicators/organization-indicators.component';
import { ApiModule } from './core/identity-viewer-api/api.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutDocumentComponent } from './components/organization-about/about-document/about-document.component';
import { CommunicationItemComponent } from './components/organization-about/communication-item/communication-item.component';
import { CommunicationsComponent } from './components/organization-about/communications/communications.component';
import { EsgCampaignsComponent } from './components/organization-about/esg-campaigns/esg-campaigns.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  IndicatorCardInfoBottomSheetComponent,
} from './components/organization-indicators/indicator-card-info-bottom-sheet/indicator-card-info-bottom-sheet.component';
import {
  IndicatorCardInfoContentComponent,
} from './components/organization-indicators/indicator-card-info-content/indicator-card-info-content.component';
import { OrganizationAboutComponent } from './components/organization-about/organization-about.component';
import { OrganizationDocumentsComponent } from './components/organization-documents/organization-documents.component';
import { OrganizationInfoComponent } from './components/organization-info/organization-info.component';
import { MockedAppService } from './mocked-app.service';
import { RealAppService } from './real-app.service';
import { DocumentCardComponent } from './shared/document-card/document-card.component';
import { StreamValueComponent } from './shared/stream-value/stream-value.component';

const icons = [
  // Icons registry
  ['c02-emissions', 'assets/icons/c02-emissions.svg'],
  ['diversity', 'assets/icons/diversity.svg'],
  ['download', 'assets/icons/download.svg'],
  ['energy-consumption', 'assets/icons/energy-consumption.svg'],
  ['ethics', 'assets/icons/ethics.svg'],
  ['fatalities', 'assets/icons/fatalities.svg'],
  ['female-employees', 'assets/icons/female-employees.svg'],
  ['flag', 'assets/icons/flag.svg'],
  ['independent', 'assets/icons/independent.svg'],
  ['paid', 'assets/icons/paid.svg'],
  ['pin-drop', 'assets/icons/pin-drop.svg'],
  ['renewable-energy', 'assets/icons/renewable-energy.svg'],
  ['social', 'assets/icons/social.svg'],
  ['facebook', 'assets/icons/facebook.svg'],
  ['linkedin', 'assets/icons/linkedin.svg'],
];

const COMPONENTS = [
  AboutDocumentComponent,
  OrganizationAboutComponent,
  OrganizationInfoComponent,
  CommunicationsComponent,
  CommunicationItemComponent,
  OrganizationIndicatorsComponent,
  EsgCampaignsComponent,
  FooterComponent,
  IndicatorBarChartComponent,
  IndicatorCardComponent,
  IndicatorCardInfoBottomSheetComponent,
  IndicatorCardInfoContentComponent,
  OrganizationDocumentsComponent,
  DocumentCardComponent,
  StreamValueComponent,
];

GlobalWorkerOptions.workerSrc = './pdfjs-dist/pdf.worker.min.js';

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: `${environment.identityApiUrl}/${environment.t3ApiVersion}` }),
    AppRoutingModule,
    ApplyModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    IconModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgChartsModule,
    RedactedModule,
    SkeletonModule,
  ],
  providers: [{
    provide: AppService,
    useClass: environment.production ? RealAppService : MockedAppService,
  }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    icons.forEach(([name, path]) => matIconRegistry.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(path)));
  }
}
