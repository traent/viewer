import { Component } from '@angular/core';
import { sustainabilityGoalMap } from '../../app.config-data';

import { AppService } from '../../app.service';
import { formatNumber } from '../../shared/format-utils';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss'],
})
export class OrganizationInfoComponent {
  readonly allianceRole$ = this.appService.allianceRole$;
  readonly companyDescription$ = this.appService.companyDescription$;
  readonly funding$ = this.appService.funding$;
  readonly industry$ = this.appService.industry$;
  readonly isLookingFinancing$ = this.appService.isLookingFinancing$;
  readonly numberOfEmployees$ = this.appService.numberOfEmployees$;
  readonly revenue$ = this.appService.revenue$;
  readonly valuation$ = this.appService.valuation$;
  readonly goals$ = this.appService.goals$;

  readonly foundation$ = this.appService.getFoundation();
  readonly logo$ = this.appService.getLogo();
  readonly address$ = this.appService.getAddress();
  readonly company$ = this.appService.getCompanyName();
  readonly web$ = this.appService.getWeb();
  readonly providedBy$ = this.appService.getProvidedBy();
  readonly isClaimableOnTraent$ = this.appService.isClaimableOnTraent();

  readonly formatNumber = formatNumber;
  readonly sustainabilityGoalMap = sustainabilityGoalMap;

  constructor(private readonly appService: AppService) { }

}
