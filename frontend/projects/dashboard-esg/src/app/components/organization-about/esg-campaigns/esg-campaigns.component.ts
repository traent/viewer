import { Component } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-esg-campaigns',
  templateUrl: './esg-campaigns.component.html',
  styleUrls: ['./esg-campaigns.component.scss'],
})
export class EsgCampaignsComponent {

  readonly campaign$ = this.appService.campaign$;

  constructor(private readonly appService: AppService) { }

}
