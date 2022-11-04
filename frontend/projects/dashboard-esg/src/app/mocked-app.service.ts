/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Redactable, RedactedMarker } from '@traent/ngx-components';
import { of, tap, Observable, interval, startWith, first, shareReplay, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { indicatorDefinitions, REPORT_YEAR } from './app.config-data';
import { buildIndicatorModel, IndicatorModel } from './app.model';
import { RedactableStream, RedactableDocument, AppService } from './app.service';

import { Document } from './core/documents';
import { Organization } from './core/organization';

export const randomInt = (): number => {
  const min = 500;
  const max = 2500;
  const difference = max - min;
  let rand = Math.random();
  rand = Math.floor( rand * difference);
  rand = rand + min;
  return rand;
};

const fakeRedactableStreamObs = (streamEntry: any): Observable<RedactableStream> => interval(randomInt()).pipe(
  first(),
  map(() => (streamEntry as any)),
);

const fakeIndicatorModelObs = (definition: any, [company, average]: any) => interval(randomInt()).pipe(
  first(),
  map(() => [company, average]),
  map(([s, a]) => buildIndicatorModel(definition, REPORT_YEAR, s.value, a.value)),
  startWith(buildIndicatorModel(definition, REPORT_YEAR, null, null)),
);

@Injectable()
export class MockedAppService extends AppService {

  // 'Leader' | 'Member' | undefined
  readonly allianceRole$: Observable<RedactableStream> = fakeRedactableStreamObs({value: 'Member'}); // of({ value: 'Member' } as any);

  readonly companyDescription$: Observable<RedactableStream> = fakeRedactableStreamObs({value: 'Bubba Gump is a multinational corporation that designs, manufactures, and markets consumer electronics, personal computers, and software.'}); // of({ value: 'Bubba Gump is a multinational corporation that designs, manufactures, and markets consumer electronics, personal computers, and software.' } as any);
  // readonly companyDescription$: Observable<RedactableStream> = of({ value: undefined } as any);
  // readonly companyDescription$: Observable<RedactableStream> = of({ value: RedactedMarker } as any);

  readonly industry$: Observable<RedactableStream> = fakeRedactableStreamObs({value: 'Food and beverage'}); // of({ value: 'Food and beverage' } as any);
  readonly isLookingFinancing$: Observable<RedactableStream> = fakeRedactableStreamObs({value: true}); // of({ value: true } as any);
  readonly numberOfEmployees$: Observable<RedactableStream> = fakeRedactableStreamObs({value: 10000}); // of({ value: 10000 } as any);

  readonly funding$: Observable<RedactableStream> = fakeRedactableStreamObs({
    value: 340000,
    configuration: {symbol: '$'},
  }); // of({ value: 340000, configuration: { symbol: '$' } } as any);
  readonly valuation$: Observable<RedactableStream> = fakeRedactableStreamObs({
    value: 20000000,
    configuration: {symbol: '$'},
  }); // of({ value: 20000000, configuration: { symbol: '$' } } as any);
  // readonly revenue$: Observable<RedactableStream> = of({ value: 190000, configuration: { symbol: '$' } } as any);
  // readonly revenue$: Observable<RedactableStream> = of(undefined);
  // readonly revenue$: Observable<RedactableStream> = of(RedactedMarker);
  readonly revenue$: Observable<RedactableStream> = fakeRedactableStreamObs({value: 56, configuration: RedactedMarker}); // interval(randomInt()).pipe(
  //   first(),
  //   map(() => ({ value: 56, configuration: RedactedMarker } as any)),
  // );

  readonly renewableEnergy$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.renewableEnergy, [{value: RedactedMarker}, {value: 24}]); // interval(randomInt()).pipe(

  readonly scopeEmissions$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.scopeEmissions, [{value: undefined}, {value: undefined}]); //of([{ value: 14.1 }, { value: 24 }]).pipe(

  readonly femaleEmployees$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.femaleEmployees, [{value: 100}, {value: 37}]); //of([{ value: 41 }, { value: 37 }]).pipe(

  readonly socialCommitment$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.socialCommitment, [{value: 3000}, {value: 4000}]); //of([{ value: 3000 }, { value: 4000 }]).pipe(

  readonly ethicsBreach$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.ethicsBreach, [{value:1}, {value: 0}]); //of([{ value: 0 }, { value: 2 }]).pipe(

  readonly independentDirectors$: Observable<IndicatorModel | undefined> =
    fakeIndicatorModelObs(indicatorDefinitions.independentDirector, [{value: 51}, {value: 78}]); //of([{ value: 51 }, { value: 78 }]).pipe(

  readonly pledge$: Observable<RedactableDocument> = of({id: 'id1', name: 'pledge'} as any);
  readonly report$: Observable<RedactableDocument> = of({id: 'id2', name: 'report'} as any);
  readonly productPresentation$: Observable<RedactableDocument> = of({id: 'id3', name: 'productPresentation'} as any);

  readonly pitchBook$: Observable<RedactableDocument> =
    interval(randomInt()).pipe(
      first(),
      // map(() => [ RedactedMarker ]),
      map(() => ({id: 'id1', name: 'pitchbook'}) as any),
      startWith(null),
      tap((val) => console.log('pitchbook', val)),
      shareReplay({bufferSize: 1, refCount: true}),
    );

  readonly campaign$: Observable<RedactableDocument> = of({id: 'id1', name: 'campaign'} as any);

  readonly goals$: Observable<Redactable<string[]> | undefined> = interval(randomInt()).pipe(
    first(),
    map(() => [
      'No poverty',
      'Zero Hunger',
      // 'Good Health and Well Being',
      // 'Quality Education',
      // 'Gender Equality',
      // 'Clean Water and Sanitation',
      // 'Affordable and Clean Energy',
      'Decent Work and Economic Growth',
      'Industry, Innovation and Infrastructure',
      'Reduced Inequalities',
      'Sustainable Cities and Communities',
      // 'Responsible Consumption and Production',
      // 'Climate Action',
      // 'Life Below Water',
      // 'Life On Land',
      'Peace, Justice and Strong Institutions',
      'Partnership For The Goals',
    ]),
  );
  // readonly goals$: Observable<Redactable<string[]> | undefined> = of(RedactedMarker);
  // readonly goals$: Observable<Redactable<string[]> | undefined> = of(undefined);

  communications$: Observable<RedactableDocument[]> =
    interval(randomInt()).pipe(
      first(),
      // map(() => [ RedactedMarker ]),
      map(() => ([
        {id: 'id1', name: 'Communication 1'},
        {id: 'id2', name: RedactedMarker},
        {id: 'id3', name: 'Communication 3'},
        {id: 'id4', name: 'Communication 4'},
      ]) as any),
      startWith([null, null]),
      tap((val) => console.log('event', val)),
      shareReplay({bufferSize: 1, refCount: true}),
    );

  // eslint-disable-next-line class-methods-use-this
  getFoundation(): Promise<string> {
    return firstValueFrom(interval(randomInt()).pipe(map(() => '1984')));
  }

  // eslint-disable-next-line class-methods-use-this
  async getLogo(): Promise<string> {
    return firstValueFrom(interval(randomInt()).pipe(map(() => 'assets/bubba-gump.png')));
  }

  // eslint-disable-next-line class-methods-use-this
  async getCompanyName(): Promise<string> {
    return firstValueFrom(interval(randomInt()).pipe(map(() => 'Bubba Gump')));
  }

  // eslint-disable-next-line class-methods-use-this
  async getAddress(): Promise<string> {
    return firstValueFrom(interval(randomInt()).pipe(map(() => 'San Francisco, California, USA')));
  }

  // eslint-disable-next-line class-methods-use-this
  async getWeb(): Promise<string | undefined> {
    // return firstValueFrom(interval(randomInt()).pipe(map(() => 'https://www.bubbagump.com')));
    return firstValueFrom(interval(randomInt()).pipe(map(() => undefined)));
  }

  // eslint-disable-next-line class-methods-use-this
  async getProvidedBy(): Promise<Organization | undefined> {
    // return firstValueFrom(interval(randomInt()).pipe(map(() => ({ name: 'Illuminem', logo: 'assets/logo-illuminem.png' }))));
    return firstValueFrom(interval(randomInt()).pipe(map(() => ({
      businessName: 'Acme',
      logo: 'assets/acme.png',
      id: 'organizationId',
    } as any))));
  }

  // eslint-disable-next-line class-methods-use-this
  async isClaimableOnTraent(): Promise<Redactable<boolean> | undefined> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async getThumbnailFromDocument(_: Document): Promise<string | undefined> {
    return firstValueFrom(interval(randomInt()).pipe(map(() => ('url(assets/about_sample.png)' as any))));
  }
}
