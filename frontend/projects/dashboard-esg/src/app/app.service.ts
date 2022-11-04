import { Injectable } from '@angular/core';
import { Redactable, RedactedType } from '@traent/ngx-components';
import { Observable } from 'rxjs';
import { IndicatorModel } from './app.model';

import { Document } from './core/documents';
import { Organization } from './core/organization';
import { StreamEntry } from './core/streams';

export type RedactableStream = StreamEntry
  | RedactedType
  | undefined;

export type RedactableDocument = Document
  | RedactedType
  | undefined
  | null;

@Injectable()
export abstract class AppService {

  // 'Leader' | 'Member' | undefined
  abstract allianceRole$: Observable<RedactableStream>;

  abstract companyDescription$: Observable<RedactableStream>;
  abstract industry$: Observable<RedactableStream>;
  abstract isLookingFinancing$: Observable<RedactableStream>;
  abstract numberOfEmployees$: Observable<RedactableStream>;
  abstract funding$: Observable<RedactableStream>;
  abstract valuation$: Observable<RedactableStream>;
  abstract revenue$: Observable<RedactableStream>;

  abstract renewableEnergy$: Observable<IndicatorModel | undefined>;

  abstract scopeEmissions$: Observable<IndicatorModel | undefined>;

  abstract femaleEmployees$: Observable<IndicatorModel | undefined>;

  abstract socialCommitment$: Observable<IndicatorModel | undefined>;

  abstract ethicsBreach$: Observable<IndicatorModel | undefined>;

  abstract independentDirectors$: Observable<IndicatorModel | undefined>;

  abstract pledge$: Observable<RedactableDocument>;
  abstract report$: Observable<RedactableDocument>;
  abstract productPresentation$: Observable<RedactableDocument>;

  abstract pitchBook$: Observable<RedactableDocument>;

  abstract campaign$: Observable<RedactableDocument>;

  abstract goals$: Observable<Redactable<string[]> | undefined>;

  abstract communications$: Observable<RedactableDocument[]>;

  abstract getLogo(): Promise<string>;

  abstract getFoundation(): Promise<string>;

  abstract getCompanyName(): Promise<string>;

  abstract getAddress(): Promise<string>;

  abstract getWeb(): Promise<string | undefined>;

  abstract getProvidedBy(): Promise<Organization | undefined>;

  abstract isClaimableOnTraent(): Promise<Redactable<boolean> | undefined>;

  abstract getThumbnailFromDocument(doc: Document): Promise<string | undefined>;

}
