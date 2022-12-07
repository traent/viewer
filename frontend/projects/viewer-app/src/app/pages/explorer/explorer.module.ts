import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, TabsModule, TagModule, ClickToCopyModule, CopyToClipboardModule, TableModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import { NgxT3SpinnerModule } from '@traent/ngx-spinner';
import { TopbarModule, Uint8PipeModule } from '@viewer/shared';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { BlockRowItemComponent } from './components/block-row-item/block-row-item.component';
import { BlockTabContentComponent } from './components/block-tab-content/block-tab-content.component';
import { ExpandableItemComponent } from './components/expandable-item/expandable-item.component';
import { InChainKeysTabContentComponent } from './components/in-chain-keys-tab-content/in-chain-keys-tab-content.component';
import { MiscellaneousTabContentComponent } from './components/miscellaneous-tab-content/miscellaneous-tab-content.component';
import { OffChainKeysTabContentComponent } from './components/off-chain-keys-tab-content/off-chain-keys-tab-content.component';
import { OffChainRowItemComponent } from './components/off-chain-row-item/off-chain-row-item.component';
import { OffChainTabContentComponent } from './components/off-chain-tab-content/off-chain-tab-content.component';
import { ProofsTabContentComponent } from './components/proofs-tab-content/proofs-tab-content.component';
import { ViewEncryptedDataComponent } from './components/view-encrypted-data/view-encrypted-data.component';
import { ExplorerPageComponent } from './explorer-page.component';
import { ExplorerPageRoutingModule } from './explorer-routing.module';

@NgModule({
  declarations: [
    BlockRowItemComponent,
    BlockTabContentComponent,
    ExpandableItemComponent,
    ExplorerPageComponent,
    InChainKeysTabContentComponent,
    MiscellaneousTabContentComponent,
    OffChainKeysTabContentComponent,
    OffChainRowItemComponent,
    OffChainTabContentComponent,
    ProofsTabContentComponent,
    ViewEncryptedDataComponent,
  ],
  imports: [
    ApplyModule,
    CdkAccordionModule,
    ClickToCopyModule,
    CommonModule,
    CopyToClipboardModule,
    ExplorerPageRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    NgxT3PaginatorModule,
    NgxT3SpinnerModule,
    ScrollingModule,
    TableModule,
    TabsModule,
    TagModule,
    TopbarModule,
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class ExplorerPageModule { }
