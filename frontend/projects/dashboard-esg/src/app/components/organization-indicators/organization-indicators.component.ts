import { Component } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-organization-indicators',
  templateUrl: './organization-indicators.component.html',
  styleUrls: ['./organization-indicators.component.scss'],
})
export class OrganizationIndicatorsComponent {
  readonly renewableEnergy$ = this.appService.renewableEnergy$;
  readonly scopeEmissions$ = this.appService.scopeEmissions$;
  readonly femaleEmployees$ = this.appService.femaleEmployees$;
  readonly socialCommitment$ = this.appService.socialCommitment$;
  readonly ethicsBreach$ = this.appService.ethicsBreach$;
  readonly independentDirectors$ = this.appService.independentDirectors$;
  readonly industry$ = this.appService.industry$;

  constructor(private readonly appService: AppService) { }

}
