import { A11yModule } from '@angular/cdk/a11y';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  ClickToCopyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  IconModule,
  IdentityModule,
  NgxT3ListModule,
  NoValueLabelModule,
  PreventClickPropagationModule,
  RedactedModule,
  RightSidebarModule,
  SidebarHeaderModule,
  SkeletonModule,
  TagModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import { NgxT3TooltipModule } from '@traent/ngx-tooltip';
import { GlobalWorkerOptions } from 'pdfjs-dist';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CachedHttpLoader } from './cached-http-loader';
import { AcknowledgementsDialogComponent } from './components/acknowledgments-dialog/acknowledgements-dialog.component';
import { AcksIconModule } from './components/acks-icon/acks-icon.module';
import { AcksStatusModule } from './components/acks-status/acks-status.module';
import { BlockchainInfoBtnComponent } from './components/blockchain-info-btn/blockchain-info-btn.component';
import { BlockchainInfoMobileComponent } from './components/blockchain-info-mobile/blockchain-info-mobile.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { DocumentActionsMobileComponent } from './components/document-actions-mobile/document-actions-mobile.component';
import { DocumentContentComponent } from './components/document-content/document-content.component';
import { DocumentDetailsMobileComponent } from './components/document-details-mobile/document-details-mobile.component';
import { DocumentDetailsComponent } from './components/document-details/document-details.component';
import { DocumentListItemComponent } from './components/document-list-item/document-list-item.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentTagsPickerComponent } from './components/document-tags-picker/document-tags-picker.component';
import { HeaderNewsStatusComponent } from './components/header-news-status/header-news-status.component';
import { ParticipantIdentityComponent } from './components/participant-identity/participant-identity.component';
import { ProjectInfoComponent } from './components/project-info/project-info.component';
import { ProjectParticipantsListComponent } from './components/project-participants-list/project-participants-list.component';
import { RedactableTagComponent } from './components/redactable-tag/redactable-tag.component';
import { ShareButtonsComponent } from './components/share-buttons/share-buttons.component';
import { ShareLinkMobileComponent } from './components/share-link-mobile/share-link-mobile.component';
import { TagsFilterMobileComponent } from './components/tags-filter-mobile/tags-filter-mobile.component';
import { WorkflowStatesComponent } from './components/workflow-states/workflow-states.component';
import { IdentityValidationModule } from './identity-validation/identity-validation.module';
import { ApiModule } from './identity-viewer-api/api.module';
import { PdfViewerModule } from './pdf-viewer';
import { NgxT3PickerModule } from './picker-module/picker.module';
import { SocialShareModule } from './social-share';
import { Uint8PipeModule } from './uint8/uint8.module';

GlobalWorkerOptions.workerSrc = './pdfjs-dist/pdf.worker.min.js';

const HttpLoaderFactory = (http: HttpBackend) => new CachedHttpLoader(http, './assets/i18n/', '.json');

const COMPONENTS = [
  AcknowledgementsDialogComponent,
  BlockchainInfoMobileComponent,
  BlockchainInfoBtnComponent,
  CompanyInfoComponent,
  DocumentActionsMobileComponent,
  DocumentContentComponent,
  DocumentDetailsComponent,
  DocumentDetailsMobileComponent,
  DocumentListComponent,
  DocumentListItemComponent,
  DocumentTagsPickerComponent,
  HeaderNewsStatusComponent,
  ParticipantIdentityComponent,
  ProjectInfoComponent,
  ProjectParticipantsListComponent,
  RedactableTagComponent,
  ShareButtonsComponent,
  ShareLinkMobileComponent,
  TagsFilterMobileComponent,
  WorkflowStatesComponent,
];

const ICONS: string[][] = [
  // Icons registry
  ['ack-ok', 'assets/opal/icons/ack-ok.svg'],
  ['company-logo', 'assets/opal/icons/company-logo-icon.svg'],
  ['facebook', 'assets/opal/icons/facebook.svg'],
  ['linkedin', 'assets/opal/icons/linkedin.svg'],
  ['not-verified', 'assets/opal/icons/not-verified.svg'],
  ['twitter', 'assets/opal/icons/twitter.svg'],
  ['verified', 'assets/opal/icons/verified.svg'],
];

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // External libs Modules
    ApiModule.forRoot({ rootUrl: `${environment.identityApiUrl}/${environment.t3ApiVersion}` }),
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    // Material Modules
    A11yModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    // AE Modules
    ApplyModule,
    ClickToCopyModule,
    CopyToClipboardModule,
    DescriptionsModule,
    IconModule,
    IdentityModule,
    NgxT3ListModule,
    NgxT3PaginatorModule,
    NgxT3PickerModule,
    NgxT3TooltipModule,
    PreventClickPropagationModule,
    RedactedModule,
    RightSidebarModule,
    SidebarHeaderModule,
    SkeletonModule,
    TagModule,
    // Internal Modules
    AcksIconModule,
    AcksStatusModule,
    AppRoutingModule,
    IdentityValidationModule,
    NoValueLabelModule,
    PdfViewerModule,
    SocialShareModule,
    Uint8PipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    ICONS.forEach(([name, path]) => matIconRegistry.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(path)));
  }
}
