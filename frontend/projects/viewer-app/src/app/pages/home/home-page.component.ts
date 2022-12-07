import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InvalidLedgerKeysError, LedgerError, NoAvailableDecryptionKeyError } from '@viewer/models';
import { DocumentService, LedgerService, StorageService } from '@viewer/services';
import {
  extractNavigationValuesFromDefaultPage,
  getHeaderControlFromRoute,
  getHideCancelUploadControlFromRoute,
} from '@viewer/utils';
import { NgxT3DialogService } from '@traent/ngx-dialog';
import { abortableGenerator, ProcessAbortError } from '@traent/ts-utils';
import { map, timer, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoadingLabel {
  index: number;
  total?: number;
  message: string;
}

const loadingPercentage = (index?: number, total?: number): number => {
  if (!index || !total) {
    return 0;
  }
  const percentage = Math.round((index / total) * 100);
  return percentage;
};

const fancyMessages = [
  'i18n.Home.upload.fancyMessages.step1',
  'i18n.Home.upload.fancyMessages.step2',
  'i18n.Home.upload.fancyMessages.step3',
];

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  animations: [
    trigger('buttons', [
      state('*', style({ transform: 'translateX(0)' })),
      state('void', style({ transform: 'translateX(-100%)' })),
      transition('* => void', [animate('400ms ease-in')]),
      transition('void => *', [animate('400ms ease-in')]),
    ]),
    trigger('urlInput', [
      state('*', style({ transform: 'translateX(0)' })),
      state('void', style({ transform: 'translateX(200%)' })),
      transition('* => void', [animate('400ms ease-in')]),
      transition('void => *', [animate('400ms ease-in')]),
    ]),
  ],
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  readonly fancyMessages$ = timer(0, 3000).pipe(
    map(() => fancyMessages[Math.floor(Math.random() * fancyMessages.length)]),
  );

  readonly companyName = environment.companyName;
  readonly loadingPercentage = loadingPercentage;
  readonly params$ = this.route.queryParams.pipe(
    switchMap(async ({ ledgerUrl, documentName }) => {
      if (ledgerUrl) {
        await this.loadData(ledgerUrl, !documentName);

        if (!documentName) {
          return;
        }

        const { items } = await this.documentService.getDocumentCollection({
          sortOrder: 'desc',
          sortBy: 'version',
          page: 1,
        });
        const document = items.find(({ name }) => name === documentName);

        if (document === undefined) {
          await this.router.navigate(['project'], { queryParamsHandling: 'preserve' });
          return;
        }

        await this.router.navigate(['project', 'documents', document.id, 'content', 'log'], { queryParamsHandling: 'preserve' });
      }
    }),
  );

  abortController?: AbortController;
  error?: 'generic' | 'validation';
  fileName?: string;
  loadingMessage?: LoadingLabel;
  process?: AsyncGenerator<LoadingLabel, void>;
  showUrlInput = false;

  readonly showHeader = getHeaderControlFromRoute(this.route.snapshot);
  readonly showCancelUpload = !getHideCancelUploadControlFromRoute(this.route.snapshot);

  constructor(
    private readonly dialogService: NgxT3DialogService,
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storageService: StorageService,
    readonly ledgerService: LedgerService,
    readonly translateService: TranslateService,
  ) {
  }

  async loadData(data: File | string, withNavigation = true): Promise<void> {
    if (typeof data === 'string') {
      this.fileName = decodeURI(data.split('/').pop() || '');
    } else {
      this.fileName = data.name;
    }

    this.abortController = new AbortController();

    try {
      this.process = abortableGenerator(this.loadingProcess(data), this.abortController.signal);
      for await (const message of this.process) {
        this.loadingMessage = message;
      }
      if (withNavigation) {
        await this.navigateMainPage();
      }
    } catch (error: unknown) {
      if (error instanceof NoAvailableDecryptionKeyError || error instanceof InvalidLedgerKeysError) {
        this.reset();
        const proceed = await this.dialogService.confirm({
          title: this.translateService.instant('i18n.Home.noDecryptionKey.title'),
          description: this.translateService.instant('i18n.Home.noDecryptionKey.description'),
          primaryLabel: this.translateService.instant('i18n.Common.proceed'),
          secondaryLabel: this.translateService.instant('i18n.Common.cancel'),
        });

        if (proceed) {
          await this.router.navigate(['explorer'], { queryParamsHandling: 'preserve' });
        }
      } else if (error instanceof ProcessAbortError) {
        this.reset();
      } else if (error instanceof LedgerError) {
        this.error = 'validation';
      } else {
        if (error instanceof Object && error.hasOwnProperty('message')) {
          this.loadingMessage = undefined;
          this.error = 'generic';
        }
      }
    }
  }

  reset(): void {
    this.process = undefined;
    this.error = undefined;
    this.loadingMessage = undefined;
    this.abortController = undefined;
    this.ledgerService.reset();
  }

  async startLocalFileLoad(target: HTMLInputElement | FileList) {
    let file: File | null = null;
    if (target instanceof HTMLInputElement) {
      file = target.files && target.files.item(0);
      if (file) {
        target.value = ''; // prevent onchange not firing on same file
      }
    } else if (target instanceof FileList) {
      file = target.item(0);
    }

    if (file) {
      await this.loadData(file);
    }
  }

  async invalidLedgerNavigation(): Promise<void> {
    const proceed = await this.dialogService.confirm({
      title: this.translateService.instant('i18n.Home.invalidLedger.title'),
      description: this.translateService.instant('i18n.Home.invalidLedger.subtitle'),
      primaryLabel: this.translateService.instant('i18n.Home.invalidLedger.understandRisk'),
      secondaryLabel: this.translateService.instant('i18n.Common.goBack'),
      classes: ['danger', 'opal-w-500px'],
    });
    if (!proceed) {
      return;
    }

    this.navigateMainPage();
  }

  private async *loadingProcess(data: string | Blob): AsyncGenerator<LoadingLabel, void> {
    yield {
      index: 1,
      message: 'i18n.Home.loadingData',
    };

    for await (const progress of this.ledgerService.load(data)) {
      const index = progress.checkedBlocks + 1;
      yield {
        index: index + 1,
        total: progress.totalBlocks,
        message: this.translateService.instant('i18n.Home.evaluatingLedgerBlock', { index, totalBlocks: progress.totalBlocks }),
      };
    }
  }

  private async navigateMainPage() {
    const exReq = await this.storageService.getLedger().getExportRequest();

    if (exReq?.defaultPage) {
      const options = extractNavigationValuesFromDefaultPage(exReq.defaultPage);
      if (options?.baseUrlWithoutQueryParams) {
        await this.router.navigate(
          [options.baseUrlWithoutQueryParams],
          { queryParams: options.queryParams, queryParamsHandling: 'merge' },
        );
        return;
      }
    }

    await this.router.navigate(['project', { queryParamsHandling: 'preserve' }]);
  }
}
