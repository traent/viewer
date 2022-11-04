import { Injectable } from '@angular/core';
import { isExportedAndDefined } from '@traent/ngx-components';
import { unreachable } from '@traent/ts-utils';
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { of, from, switchMap, combineLatest, shareReplay, firstValueFrom } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { getDocumentProxyFromUrl } from '../../../dashboard-fact-checking/src/app/file';
import { environment } from '../environments/environment';
import {
  DOC_CAMPAIGN_TAG,
  DOC_COMMUNICATION_TAG,
  DOC_ESG_PLEDGE_NAME,
  DOC_ESG_REPORT_NAME,
  DOC_PITCH_BOOK_NAME,
  DOC_PRODUCT_PRESENTATION_TAG,
  REPORT_YEAR,
  STREAM_ALLIANCE_ROLE_NAME,
  STREAM_COMPANY_DESCRIPTION_NAME,
  STREAM_ETHICS_BREACH_AVERAGE_NAME,
  STREAM_ETHICS_BREACH_NAME,
  STREAM_FUNDING_NAME,
  STREAM_INDEPENDENT_DIRECTORS_AVERAGE_NAME,
  STREAM_INDEPENDENT_DIRECTORS_NAME,
  STREAM_INDICATOR_FEMALE_EMPLOYEES_AVERAGE_NAME,
  STREAM_INDICATOR_FEMALE_EMPLOYEES_NAME,
  STREAM_INDICATOR_RENEWABLE_ENERGY_AVERAGE_NAME,
  STREAM_INDICATOR_RENEWABLE_ENERGY_NAME,
  STREAM_INDICATOR_SCOPE_EMISSIONS_AVERAGE_NAME,
  STREAM_INDICATOR_SCOPE_EMISSIONS_NAME,
  STREAM_INDICATOR_SOCIAL_COMMITMENT_AVERAGE_NAME,
  STREAM_INDICATOR_SOCIAL_COMMITMENT_NAME,
  STREAM_INDUSTRY_NAME,
  STREAM_LOOKING_FOR_FINANCING_NAME,
  STREAM_NUMBER_OF_EMPLOYEES_NAME,
  STREAM_ORGANIZATION_ID_NAME,
  STREAM_PROVIDED_BY_NAME,
  STREAM_REVENUE_NAME,
  STREAM_SUSTAINABILITY_GOALS_NAME,
  STREAM_VALUATION_NAME,
  indicatorDefinitions,
} from './app.config-data';
import { buildIndicatorModel } from './app.model';
import { AppService } from './app.service';

import { DocumentsService, Document, DocumentContentType } from './core/documents';
import { OrganizationService, Organization } from './core/organization';
import { ParticipantsService } from './core/participants';
import { StreamsService, StreamEntry } from './core/streams';
import { Tag, TagsService } from './core/tags';

/**
 * Indicators expressed via boolean streams are adapted to number to match the IndicatorModel interface.
 * true -> 1
 * false -> 0
 */
const convertBooleanStreamValue = (value: any): any => value === true ? 1 : value === false ? 0 : value;

@Injectable( { providedIn: 'root' })
export class RealAppService extends AppService {

  readonly allianceRole$ = from(this.streamsService.getStreamByName(STREAM_ALLIANCE_ROLE_NAME));
  readonly companyDescription$ = from(this.streamsService.getStreamByName(STREAM_COMPANY_DESCRIPTION_NAME));
  readonly funding$ = from(this.streamsService.getStreamByName(STREAM_FUNDING_NAME));
  readonly industry$ = from(this.streamsService.getStreamByName(STREAM_INDUSTRY_NAME));
  readonly isLookingFinancing$ = from(this.streamsService.getStreamByName(STREAM_LOOKING_FOR_FINANCING_NAME));
  readonly numberOfEmployees$ = from(this.streamsService.getStreamByName(STREAM_NUMBER_OF_EMPLOYEES_NAME));
  readonly revenue$ = from(this.streamsService.getStreamByName(STREAM_REVENUE_NAME));
  readonly valuation$ = from(this.streamsService.getStreamByName(STREAM_VALUATION_NAME));

  readonly renewableEnergy$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_INDICATOR_RENEWABLE_ENERGY_NAME),
    this.streamsService.getStreamByName(STREAM_INDICATOR_RENEWABLE_ENERGY_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(indicatorDefinitions.renewableEnergy, REPORT_YEAR, s?.value, a?.value)),
  );

  readonly scopeEmissions$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_INDICATOR_SCOPE_EMISSIONS_NAME),
    this.streamsService.getStreamByName(STREAM_INDICATOR_SCOPE_EMISSIONS_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(indicatorDefinitions.scopeEmissions, REPORT_YEAR, s?.value, a?.value)),
  );

  readonly femaleEmployees$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_INDICATOR_FEMALE_EMPLOYEES_NAME),
    this.streamsService.getStreamByName(STREAM_INDICATOR_FEMALE_EMPLOYEES_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(indicatorDefinitions.femaleEmployees, REPORT_YEAR, s?.value, a?.value)),
  );

  readonly socialCommitment$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_INDICATOR_SOCIAL_COMMITMENT_NAME),
    this.streamsService.getStreamByName(STREAM_INDICATOR_SOCIAL_COMMITMENT_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(indicatorDefinitions.socialCommitment, REPORT_YEAR, s?.value, a?.value)),
  );

  readonly ethicsBreach$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_ETHICS_BREACH_NAME),
    this.streamsService.getStreamByName(STREAM_ETHICS_BREACH_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(
      indicatorDefinitions.ethicsBreach,
      REPORT_YEAR,
      convertBooleanStreamValue(s?.value),
      convertBooleanStreamValue(a?.value),
    )),
  );

  readonly independentDirectors$ = combineLatest([
    this.streamsService.getStreamByName(STREAM_INDEPENDENT_DIRECTORS_NAME),
    this.streamsService.getStreamByName(STREAM_INDEPENDENT_DIRECTORS_AVERAGE_NAME),
  ]).pipe(
    map(([s, a]) => buildIndicatorModel(indicatorDefinitions.independentDirector, REPORT_YEAR, s?.value, a?.value)),
  );

  readonly pledge$ = from(this.documentsService.getDocumentByName(DOC_ESG_PLEDGE_NAME));
  readonly report$ = from(this.documentsService.getDocumentByName(DOC_ESG_REPORT_NAME));
  readonly pitchBook$ = from(this.documentsService.getDocumentByName(DOC_PITCH_BOOK_NAME));

  readonly productPresentation$ = from(this.tagsService.getTagByName(DOC_PRODUCT_PRESENTATION_TAG)).pipe(
    filter((tag): tag is Tag => !!tag),
    switchMap((tag) => this.documentsService.getDocumentCollection({ page: 1, tagId: tag.id })),
    map((page) => page.items && page.items[0] ? page.items[0] : undefined),
  );

  readonly campaign$ = from(this.tagsService.getTagByName(DOC_CAMPAIGN_TAG)).pipe(
    filter((tag): tag is Tag => !!tag),
    switchMap((tag) => this.documentsService.getDocumentCollection({ page: 1, tagId: tag.id })),
    map((page) => page.items && page.items[0] ? page.items[0] : undefined),
  );

  readonly goals$ = from(this.streamsService.getStreamByName(STREAM_SUSTAINABILITY_GOALS_NAME)).pipe(
   filter((stream): stream is StreamEntry => !!stream),
   map((stream) => (
     stream.value
     .filter((value: string | undefined): value is string => !!value)),
   ),
  );

  readonly communications$ = from(this.tagsService.getTagByName(DOC_COMMUNICATION_TAG)).pipe(
    filter((tag): tag is Tag => !!tag),
    switchMap((tag) => this.documentsService.getDocumentCollection({ page: 1, tagId: tag.id })),
    map((page) => page.items),
  );

  readonly organization$ = from(this.streamsService.getStreamByName(STREAM_ORGANIZATION_ID_NAME)).pipe(
    map((s) => s?.value),
    switchMap((organizationId) => organizationId
      ? this.organizationService.getOrganization(organizationId)
      : of(undefined)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly providedByOrganization$ = from(this.streamsService.getStreamByName(STREAM_PROVIDED_BY_NAME)).pipe(
    switchMap((s) => s?.updaterId && isExportedAndDefined(s.updaterId)
      ? this.participantsService.getLedgerParticipant(s.updaterId)
      : of(undefined),
    ),
    switchMap((participant) => participant && isExportedAndDefined(participant.organizationId)
      ? this.organizationService.getOrganization(participant.organizationId)
      : of(undefined)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly organizationService: OrganizationService,
    private readonly participantsService: ParticipantsService,
    private readonly streamsService: StreamsService,
    private readonly tagsService: TagsService,
  ) {
    super();
  }


  getFoundation(): Promise<string> {
    return firstValueFrom(this.organization$.pipe(
      map((_) => '-'),
    ));
  }


  async getLogo(): Promise<string> {
    return firstValueFrom(this.organization$.pipe(
      map((organization) => organization && organization.logo
        ? organization.logo
        : 'assets/default-organization-avatar.svg'),
    ));
  }

  async getCompanyName(): Promise<string> {
    return firstValueFrom(this.organization$.pipe(
      map((organization) => organization && organization.businessName
        ? organization.businessName
        : '-'),
    ));
  }

  async getAddress(): Promise<string> {
    return firstValueFrom(this.organization$.pipe(
      map((_) => '-'),
    ));
  }

  async getWeb(): Promise<string | undefined> {
    return firstValueFrom(this.organization$.pipe(
      map((_) => undefined),
    ));
  }

  async getProvidedBy(): Promise<Organization | undefined> {
    return firstValueFrom(this.providedByOrganization$);
  }

  async isClaimableOnTraent(): Promise<boolean> {
    return firstValueFrom(this.providedByOrganization$.pipe(
      map((organization) => organization && organization.id === environment.illuminemId ? true : false),
    ));
  }

  // eslint-disable-next-line class-methods-use-this
  async getThumbnailFromDocument(doc: Document): Promise<string | undefined> {
    if (doc.uiType !== DocumentContentType.PDF) {
      return undefined;
    }
    const url = await doc.getDataUrl();
    const pdfDocumentProxy = url ? await getDocumentProxyFromUrl(url) : undefined;
    const pdfPageProxy = pdfDocumentProxy ? await pdfDocumentProxy.getPage(1) as PDFPageProxy : undefined;
    if (!pdfPageProxy) {
      return undefined;
    }

    const viewport = pdfPageProxy.getViewport({ scale: 1 * window.devicePixelRatio });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const canvasContext = canvas.getContext('2d') ?? unreachable(`no canvas context`);

    const task = pdfPageProxy.render({
      canvasContext,
      viewport,
      renderInteractiveForms: true,
    });
    await task.promise;
    const data = canvas.toDataURL('image/png');
    canvas?.remove();
    return `url('${data}')`;
  };

}
