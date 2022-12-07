import { Component } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-organization-documents',
  templateUrl: './organization-documents.component.html',
  styleUrls: ['./organization-documents.component.scss'],
})
export class OrganizationDocumentsComponent {
  readonly pledge$ = this.appService.pledge$;
  readonly report$ = this.appService.report$;
  readonly productPresentation$ = this.appService.productPresentation$;

  constructor(private readonly appService: AppService) { }
}
